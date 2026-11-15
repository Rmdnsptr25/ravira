const assert = require("node:assert/strict");
const { test } = require("node:test");
const express = require("express");
const { once } = require("node:events");
const bcrypt = require("bcrypt");
const {
  ALLOWED_DEV_PROJECT_REF,
  DEV_SYNTHETIC_PASSWORD,
  assertDevelopmentSeedSafety,
  resolveSafeDevSeedPassword,
} = require("../e2e/e2e-safety-gate.cjs");
const { runSeed } = require("../../scripts/seed.js");
const { runCleanupSmoke } = require("../../scripts/cleanup-smoke.js");
const { E2E_SYNTHETIC_PASSWORD } = require("../e2e/seed-e2e.cjs");
const { fixture } = require("./support/authorization-fixture.cjs");

function createSpyPrisma() {
  const calls = [];
  const upsertedUsers = [];

  const handler = (model) => ({
    findUnique: async (args) => {
      calls.push({ model, op: "findUnique", args });
      return null;
    },
    findFirst: async (args) => {
      calls.push({ model, op: "findFirst", args });
      return null;
    },
    findMany: async (args) => {
      calls.push({ model, op: "findMany", args });
      return [];
    },
    create: async (args) => {
      calls.push({ model, op: "create", args });
      return { id: `${model}-1`, ...(args?.data || {}) };
    },
    createMany: async (args) => {
      calls.push({ model, op: "createMany", args });
      return { count: (args?.data || []).length };
    },
    update: async (args) => {
      calls.push({ model, op: "update", args });
      return { id: `${model}-1`, ...(args?.data || {}) };
    },
    updateMany: async (args) => {
      calls.push({ model, op: "updateMany", args });
      return { count: 0 };
    },
    deleteMany: async (args) => {
      calls.push({ model, op: "deleteMany", args });
      return { count: 0 };
    },
    upsert: async (args) => {
      calls.push({ model, op: "upsert", args });
      if (model === "user") {
        const record = { id: `user-${upsertedUsers.length + 1}`, ...(args?.create || {}) };
        upsertedUsers.push(record);
        return record;
      }
      return { id: `${model}-1`, ...(args?.create || {}) };
    },
  });

  const prisma = new Proxy(
    {
      $transaction: async (ops) => {
        calls.push({ model: "$transaction", op: "transaction" });
        return Array.isArray(ops) ? Promise.all(ops) : ops(prisma);
      },
      $disconnect: async () => {},
    },
    {
      get(target, prop) {
        if (prop in target) return target[prop];
        return handler(String(prop));
      },
    }
  );

  return { prisma, calls, upsertedUsers };
}

test("SEC-QA05-01: Seeder rejects NODE_ENV=production and staging before any DB write", async () => {
  for (const nodeEnv of ["production", "PRODUCTION", "staging", "prod"]) {
    const spy = createSpyPrisma();
    await assert.rejects(
      () =>
        runSeed({
          env: {
            NODE_ENV: nodeEnv,
            DATABASE_URL: `postgresql://postgres.${ALLOWED_DEV_PROJECT_REF}:pass@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
          },
          prismaClient: spy.prisma,
          silent: true,
        }),
      /SECURITY SAFETY GATE BLOCKED/
    );
    assert.equal(spy.calls.length, 0, `Expected 0 DB calls when NODE_ENV=${nodeEnv}`);
  }
});

test("SEC-QA05-01: Seeder rejects Production DATABASE_URL and DIRECT_URL patterns before any DB write", async () => {
  const invalidEnvs = [
    {
      label: "missing DATABASE_URL",
      env: { NODE_ENV: "development", DATABASE_URL: "" },
    },
    {
      label: "Production project ref gsjonnybomydrfhsdwcc",
      env: {
        NODE_ENV: "development",
        DATABASE_URL:
          "postgresql://postgres.gsjonnybomydrfhsdwcc:secret@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
      },
    },
    {
      label: "Production pooler host aws-1-ap-south-1.pooler.supabase.com",
      env: {
        NODE_ENV: "development",
        DATABASE_URL: `postgresql://postgres.${ALLOWED_DEV_PROJECT_REF}:secret@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`,
      },
    },
    {
      label: "Unknown non-Development project ref",
      env: {
        NODE_ENV: "development",
        DATABASE_URL:
          "postgresql://postgres.unknownprojectref999:secret@db.unknown.supabase.co:5432/postgres",
      },
    },
    {
      label: "Production DIRECT_URL alongside Dev DATABASE_URL",
      env: {
        NODE_ENV: "development",
        DATABASE_URL: `postgresql://postgres.${ALLOWED_DEV_PROJECT_REF}:secret@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
        DIRECT_URL:
          "postgresql://postgres.gsjonnybomydrfhsdwcc:secret@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
      },
    },
  ];

  for (const item of invalidEnvs) {
    const spy = createSpyPrisma();
    await assert.rejects(
      () =>
        runSeed({
          env: item.env,
          prismaClient: spy.prisma,
          silent: true,
        }),
      /SAFETY GATE BLOCKED/,
      `Expected rejection for ${item.label}`
    );
    assert.equal(spy.calls.length, 0, `Expected 0 DB calls for ${item.label}`);
  }
});

test("SEC-QA05-01: Seeder rejects compromised public default password (Password123!) before any DB write", async () => {
  for (const forbiddenPassword of ["Password123!", "password", "admin123", "short"]) {
    const spy = createSpyPrisma();
    await assert.rejects(
      () =>
        runSeed({
          env: {
            NODE_ENV: "development",
            DATABASE_URL: `postgresql://postgres.${ALLOWED_DEV_PROJECT_REF}:secret@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
            SEED_PASSWORD: forbiddenPassword,
          },
          prismaClient: spy.prisma,
          silent: true,
        }),
      /SECURITY SAFETY GATE BLOCKED/
    );
    assert.equal(spy.calls.length, 0);
  }
});

test("SEC-QA05-01: Smoke cleanup script rejects Production environment and Production DATABASE_URL before any DB query", async () => {
  const prodEnvs = [
    {
      NODE_ENV: "production",
      DATABASE_URL: `postgresql://postgres.${ALLOWED_DEV_PROJECT_REF}:secret@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    },
    {
      NODE_ENV: "development",
      DATABASE_URL:
        "postgresql://postgres.gsjonnybomydrfhsdwcc:secret@aws-1-ap-south-1.pooler.supabase.com:5432/postgres",
    },
  ];

  for (const env of prodEnvs) {
    const spy = createSpyPrisma();
    await assert.rejects(
      () =>
        runCleanupSmoke({
          env,
          prismaClient: spy.prisma,
          silent: true,
        }),
      /SAFETY GATE BLOCKED/
    );
    assert.equal(spy.calls.length, 0, "Expected 0 DB calls on rejected smoke cleanup");
  }
});

test("SEC-QA05-01 & BUG-QA05-01: Development seed succeeds on Ravira-Development, seeds SUPER_ADMIN/ADMIN/CANDIDATE/RECRUITER with synchronized password, and never leaks secrets", async () => {
  const spy = createSpyPrisma();
  const logs = [];
  const origLog = console.log;
  console.log = (...args) => logs.push(args.join(" "));

  try {
    const devDbUrl = `postgresql://postgres.${ALLOWED_DEV_PROJECT_REF}:SuperSecretDbPass999@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`;
    const summary = await runSeed({
      env: {
        NODE_ENV: "development",
        DATABASE_URL: devDbUrl,
      },
      prismaClient: spy.prisma,
      silent: false,
    });

    assert.equal(summary.success, true);
    assert.equal(summary.data.projectRef, ALLOWED_DEV_PROJECT_REF);
    assert.equal(summary.data.superAdminEmail, "seed-superadmin@ravira.local");
    assert.equal(summary.data.adminEmail, "seed-admin@ravira.local");
    assert.equal(summary.data.candidateEmail, "seed-candidate@ravira.local");
    assert.equal(summary.data.recruiterEmail, "seed-recruiter@ravira.local");

    // Verify password synchronization between seed.js and seed-e2e.cjs
    assert.equal(DEV_SYNTHETIC_PASSWORD, E2E_SYNTHETIC_PASSWORD);
    assert.equal(resolveSafeDevSeedPassword({}), E2E_SYNTHETIC_PASSWORD);

    // Verify all 4 seeded roles and password hashes match E2E_SYNTHETIC_PASSWORD
    assert.equal(spy.upsertedUsers.length, 4);
    const rolesSeeded = spy.upsertedUsers.map((u) => u.role).sort();
    assert.deepEqual(rolesSeeded, ["ADMIN", "CANDIDATE", "RECRUITER", "SUPER_ADMIN"]);
    for (const u of spy.upsertedUsers) {
      const matchesPassword = await bcrypt.compare(E2E_SYNTHETIC_PASSWORD, u.passwordHash);
      assert.equal(matchesPassword, true, `Expected synchronized password hash for ${u.email}`);
    }

    // Verify stdout output and returned summary NEVER leak password, DB URL, or secrets
    const combinedOutput = JSON.stringify(summary) + "\n" + logs.join("\n");
    assert.equal("seedPassword" in summary.data, false);
    assert.equal(combinedOutput.includes(E2E_SYNTHETIC_PASSWORD), false);
    assert.equal(combinedOutput.includes("SuperSecretDbPass999"), false);
    assert.equal(combinedOutput.includes("postgresql://"), false);
  } finally {
    console.log = origLog;
  }
});

test("BUG-QA05-01: Admin routes authorize both ADMIN and SUPER_ADMIN roles while denying CANDIDATE and RECRUITER", async (t) => {
  for (const role of ["ADMIN", "SUPER_ADMIN", "CANDIDATE", "RECRUITER"]) {
    const context = fixture({
      user: { id: `user-${role.toLowerCase()}`, email: `${role.toLowerCase()}@ravira.local`, role },
    });

    const app = express();
    app.use(express.json());
    app.use("/admin", context.load("modules/admin/admin.routes.ts").default);
    app.use(context.load("middlewares/errorHandler.ts").errorHandler);

    const server = app.listen(0, "127.0.0.1");
    t.after(() => {
      server.close();
      server.closeAllConnections();
    });
    await once(server, "listening");

    const base = `http://127.0.0.1:${server.address().port}`;
    const res = await fetch(`${base}/admin/companies/pending`, {
      headers: { Authorization: `Bearer ${context.token()}` },
    });

    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      assert.equal(res.status, 200, `Expected ${role} to access /admin/companies/pending`);
    } else {
      assert.equal(res.status, 403, `Expected ${role} to be denied /admin/companies/pending`);
    }
  }
});
