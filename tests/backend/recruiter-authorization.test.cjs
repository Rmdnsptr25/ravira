const assert = require("node:assert/strict");
const { test } = require("node:test");
const { fixture, httpFixture, ids } = require("./support/authorization-fixture.cjs");

const sensitiveEndpoints = [
  { route: (job, _application) => `/recruiter/jobs/${job}/applications` },
  { route: (job, _application) => `/recruiter/jobs/${job}/candidate-scores` },
  { route: (_job, application) => `/applications/${application}` },
  { route: (_job, application) => `/applications/${application}/status-history` },
  { route: (_job, application) => `/applications/${application}/score` },
  { route: (_job, application) => `/applications/${application}/stage`, method: "POST", body: { newStatus: "SCREENING", reason: "Manual review" } }
];

for (const status of ["PENDING", "REJECTED", "SUSPENDED"]) {
  for (const endpoint of sensitiveEndpoints) {
    const route = endpoint.route(ids.job, ids.application);
    test(`denies ${route} when company is ${status}, before candidate reads or writes`, async (t) => {
      const context = await httpFixture(t, { status });
      const response = await context.request(route, endpoint);
      assert.equal(response.status, 403);
      assert.equal(response.body.data, null);
      assert.deepEqual(context.calls.map((call) => call.model), ["user", "recruiter"]);
    });
  }
}

for (const endpoint of sensitiveEndpoints) {
  const route = endpoint.route(ids.job, ids.application);
  test(`allows ${route} when company is APPROVED and owns the job`, async (t) => {
    const context = await httpFixture(t);
    const response = await context.request(route, endpoint);
    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.ok(response.body.data);
  });
  test(`hides ${route} when job belongs to another company despite spoofed ownership`, async (t) => {
    const context = await httpFixture(t);
    const foreignRoute = endpoint.route(ids.otherJob, ids.otherApplication);
    const response = await context.request(`${foreignRoute}?companyId=company-b&userId=other-user`, endpoint);
    assert.equal(response.status, 404);
    assert.equal(response.body.data, null);
    assert.ok(context.calls.every((call) => ["read", "transaction"].includes(call.operation)));
  });
  test(`denies ${route} when recruiter profile is missing`, async (t) => {
    const context = await httpFixture(t, { missingRecruiter: true });
    const response = await context.request(route, endpoint);
    assert.equal(response.status, 404);
    assert.deepEqual(context.calls.map((call) => call.model), ["user", "recruiter"]);
  });
}

test("rechecks approval after suspension with the same token", async (t) => {
  const context = await httpFixture(t);
  const authorization = `Bearer ${context.token({ companyId: "company-b", verificationStatus: "APPROVED" })}`;
  assert.equal((await context.request(`/applications/${ids.application}`, { authorization })).status, 200);
  context.company.verificationStatus = "SUSPENDED";
  context.calls.length = 0;
  const response = await context.request(`/applications/${ids.application}`, { authorization });
  assert.equal(response.status, 403);
  assert.deepEqual(context.calls.map((call) => call.model), ["user", "recruiter"]);
});

test("blocks direct sensitive service calls for unapproved recruiters", async () => {
  const context = fixture({ status: "PENDING" });
  const jobs = context.load("modules/recruiters/recruiterJobs.service.ts");
  const applications = context.load("modules/applications/applications.service.ts");
  const scoring = context.load("modules/scoring/scoring.service.ts");
  const actions = [
    () => jobs.listApplicationsForRecruiterJob(context.user.id, ids.job),
    () => applications.getApplicationById(ids.application, context.user.id, "RECRUITER"),
    () => applications.getApplicationStatusHistory(ids.application, context.user.id, "RECRUITER"),
    () => applications.updateApplicationStage(ids.application, context.user.id, "RECRUITER", { newStatus: "SCREENING", reason: "Review" }),
    () => scoring.getRecruiterJobCandidateScores(context.user.id, ids.job),
    () => scoring.getApplicationCandidateScore(ids.application, context.user.id, "RECRUITER")
  ];
  for (const action of actions) {
    context.calls.length = 0;
    await assert.rejects(action, { statusCode: 403 });
    assert.deepEqual(context.calls.map((call) => call.model), ["recruiter"]);
  }
});

test("preserves stage audit history and notification for approved recruiters", async (t) => {
  const context = await httpFixture(t);
  const response = await context.request(`/applications/${ids.application}/stage`, {
    method: "POST", body: { newStatus: "SCREENING", reason: "Manual review completed" }
  });
  assert.equal(response.status, 200);
  assert.equal(context.application.status, "SCREENING");
  const audit = context.tables.auditLog[0];
  assert.equal(audit.actorId, context.user.id);
  assert.equal(audit.actorRole, "RECRUITER");
  assert.equal(audit.reason, "Manual review completed");
  assert.equal(audit.before.status, "APPLIED");
  assert.equal(audit.after.status, "SCREENING");
  assert.equal(context.tables.applicationStatusHistory.at(-1).changedById, context.user.id);
  assert.equal(context.tables.notification[0].userId, context.candidate.userId);
});
