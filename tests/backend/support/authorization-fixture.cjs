const assert = require("node:assert/strict");
const { once } = require("node:events");
const express = require("express");
const jwt = require("jsonwebtoken");
const { isolatedBackend } = require("./isolated-backend.cjs");

const ids = Object.freeze({
  job: "10000000-0000-4000-8000-000000000001",
  application: "20000000-0000-4000-8000-000000000001",
  otherJob: "10000000-0000-4000-8000-000000000002",
  otherApplication: "20000000-0000-4000-8000-000000000002"
});

function project(record, select) {
  if (!record || !select) return record;
  return Object.fromEntries(Object.entries(select).map(([key, selection]) => {
    const value = record[key];
    return [key, selection === true ? value : Array.isArray(value)
      ? value.map((item) => project(item, selection.select)) : project(value, selection.select)];
  }));
}

function matches(record, where = {}) {
  return record != null && Object.entries(where).every(([key, value]) =>
    value !== undefined && (value !== null && typeof value === "object"
      ? matches(record[key], value) : record[key] === value));
}

function fixture(options = {}) {
  const user = { id: "recruiter-user", email: "recruiter@example.test", role: "RECRUITER", isActive: true, ...options.user };
  const company = { id: "company-a", name: "RAVIRA Test Company", verificationStatus: options.status ?? "APPROVED" };
  const recruiter = { id: "recruiter-a", userId: user.id, companyId: company.id, company };
  const candidate = {
    id: "candidate-a", userId: "candidate-user", location: "Jakarta", education: "Engineering",
    experienceSummary: "Software engineering", salaryExpectation: 100, mobilityPreference: "remote",
    profileVisibility: "PUBLIC", cvUrl: null, skills: [],
    user: { id: "candidate-user", email: "candidate@example.test", fullName: "Test Candidate", phone: "000000", isActive: true }
  };
  const job = {
    id: ids.job, companyId: company.id, company, title: "Engineer", description: "Engineering",
    location: "Jakarta", workType: "remote", status: "PUBLISHED", skills: [], createdByRecruiterId: recruiter.id
  };
  const otherJob = { ...job, id: ids.otherJob, companyId: "company-b" };
  const application = { id: ids.application, candidateId: candidate.id, jobId: job.id, candidate, job, status: "APPLIED" };
  const otherApplication = { ...application, id: ids.otherApplication, jobId: otherJob.id, job: otherJob };
  const tables = {
    user: options.missingUser ? [] : [user], recruiter: options.missingRecruiter ? [] : [recruiter],
    candidate: [candidate], job: [job, otherJob], application: [application, otherApplication],
    applicationStatusHistory: [{ id: "history-a", applicationId: application.id, application, fromStatus: null, toStatus: "APPLIED", reason: "Applied", changedBy: candidate.user }],
    matchScore: [], candidateScore: [], auditLog: [], notification: []
  };
  const calls = [];
  const prisma = Object.fromEntries(Object.entries(tables).map(([model, records]) => [model, {
    findUnique: async (args) => read(model, records, args, false),
    findFirst: async (args) => read(model, records, args, false),
    findMany: async (args) => read(model, records, args, true),
    create: async (args) => write(model, records, args, "create"),
    update: async (args) => write(model, records, args, "update"),
    upsert: async (args) => write(model, records, args, "upsert")
  }]));
  prisma.$transaction = async (callback) => {
    calls.push({ model: "$transaction", operation: "transaction" });
    return callback(prisma);
  };

  function read(model, records, args, many) {
    calls.push({ model, operation: "read", args });
    const found = records.filter((record) => matches(record, args.where));
    return many ? found.map((record) => project(record, args.select)) : project(found[0] ?? null, args.select);
  }
  function write(model, records, args, operation) {
    calls.push({ model, operation, args });
    let record = operation === "create" ? undefined : records.find((row) => matches(row, args.where));
    if (operation === "update") assert.ok(record, `Missing ${model} fixture for update`);
    if (record) Object.assign(record, args.data ?? args.update);
    else {
      record = { id: `${model}-${records.length + 1}`, ...(args.data ?? args.create) };
      records.push(record);
    }
    return project(record, args.select);
  }

  const backend = isolatedBackend(prisma);
  const token = (claims = {}, signOptions = {}) => jwt.sign(
    { sub: user.id, email: user.email, role: user.role, ...claims }, backend.env.JWT_SECRET,
    { expiresIn: "1h", ...signOptions }
  );
  return { ...backend, prisma, calls, tables, user, company, candidate, job, application, token };
}

async function httpFixture(t, options) {
  const context = fixture(options);
  const app = express();
  app.use(express.json());
  app.use("/recruiter", context.load("modules/recruiters/recruiterJobs.routes.ts").default);
  app.use("/applications", context.load("modules/applications/applications.routes.ts").default);
  app.use("/jobs", context.load("modules/jobs/jobs.routes.ts").default);
  app.use(context.load("middlewares/errorHandler.ts").errorHandler);
  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = async (route, { method = "GET", body, authorization = `Bearer ${context.token()}` } = {}) => {
    const response = await fetch(base + route, {
      method, headers: { "content-type": "application/json", ...(authorization === null ? {} : { authorization }) },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(5000)
    });
    return { status: response.status, body: await response.json() };
  };
  return { ...context, request };
}

module.exports = { fixture, httpFixture, ids, matches, project };
