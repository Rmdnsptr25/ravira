const assert = require("node:assert/strict");
const { test } = require("node:test");
const { fixture, httpFixture, ids, matches, project } = require("./support/authorization-fixture.cjs");

for (const authorization of [null, "", "Basic invalid", "Bearer ", "Bearer invalid"]) {
  test(`rejects missing or malformed authentication: ${JSON.stringify(authorization)}`, async (t) => {
    const context = await httpFixture(t);
    const response = await context.request(`/applications/${ids.application}`, { authorization });
    assert.equal(response.status, 401);
    assert.equal(response.body.data, null);
    assert.equal(context.calls.length, 0);
  });
}

test("rejects an expired token before loading the user", async (t) => {
  const context = await httpFixture(t);
  const response = await context.request(`/applications/${ids.application}`, {
    authorization: `Bearer ${context.token({}, { expiresIn: -1 })}`
  });
  assert.equal(response.status, 401);
  assert.equal(context.calls.length, 0);
});

for (const options of [{ user: { isActive: false } }, { missingUser: true }]) {
  test(`rejects inactive or missing users: ${JSON.stringify(options)}`, async (t) => {
    const context = await httpFixture(t, options);
    const response = await context.request(`/applications/${ids.application}`);
    assert.equal(response.status, 401);
    assert.deepEqual(context.calls.map((call) => call.model), ["user"]);
  });
}

test("uses the current server role instead of a stale admin token or spoofed request role", async (t) => {
  const context = await httpFixture(t, { status: "PENDING" });
  const response = await context.request(`/applications/${ids.application}/score?role=ADMIN&companyId=company-b`, {
    authorization: `Bearer ${context.token({ role: "SUPER_ADMIN" })}`
  });
  assert.equal(response.status, 403);
  assert.deepEqual(context.calls.map((call) => call.model), ["user", "recruiter"]);
});

for (const role of ["CANDIDATE", "ADMIN", "SUPER_ADMIN"]) {
  test(`denies recruiter-only routes to ${role}`, async (t) => {
    const context = await httpFixture(t, { user: { role } });
    const response = await context.request(`/recruiter/jobs/${ids.job}/applications`);
    assert.equal(response.status, 403);
    assert.deepEqual(context.calls.map((call) => call.model), ["user"]);
  });
}

for (const suffix of ["", "/status-history"]) {
  test(`preserves candidate access to their own application${suffix} for an unapproved company`, async (t) => {
    const context = await httpFixture(t, { status: "SUSPENDED", user: { id: "candidate-user", role: "CANDIDATE" } });
    const response = await context.request(`/applications/${ids.application}${suffix}`);
    assert.equal(response.status, 200);
    assert.equal(context.calls.some((call) => call.model === "recruiter"), false);
    assert.equal(JSON.stringify(response.body).includes("candidateScore"), false);
    if (suffix === "/status-history") assert.equal(response.body.data[0].toStatus, "APPLIED");
    else assert.equal(response.body.data.id, ids.application);
  });
  test(`denies candidate access to another candidate's application${suffix}`, async (t) => {
    const context = await httpFixture(t, { user: { id: "other-candidate-user", role: "CANDIDATE" } });
    context.tables.candidate.push({ id: "candidate-b", userId: context.user.id });
    const response = await context.request(`/applications/${ids.application}${suffix}?candidateId=candidate-a&userId=candidate-user`);
    assert.equal(response.status, 404);
    assert.equal(response.body.data, null);
  });
}

for (const role of ["ADMIN", "SUPER_ADMIN"]) {
  for (const suffix of ["", "/status-history", "/score"]) {
    test(`preserves ${role} access to application${suffix} without recruiter approval`, async (t) => {
      const context = await httpFixture(t, { status: "SUSPENDED", missingRecruiter: true, user: { role } });
      const response = await context.request(`/applications/${ids.application}${suffix}`);
      assert.equal(response.status, 200);
      assert.equal(context.calls.some((call) => call.model === "recruiter"), false);
      if (suffix === "/status-history") assert.equal(response.body.data[0].toStatus, "APPLIED");
      if (suffix === "/score") {
        assert.equal(typeof response.body.data.candidateScore, "number");
        assert.ok(response.body.data.explanation.length >= 3);
      }
    });
  }
}

test("keeps internal Candidate Score hidden from candidates", async (t) => {
  const context = await httpFixture(t, { user: { id: "candidate-user", role: "CANDIDATE" } });
  const response = await context.request(`/applications/${ids.application}/score`);
  assert.equal(response.status, 403);
  assert.deepEqual(context.calls.map((call) => call.model), ["user"]);
});

test("preserves candidate AI Match Score with explanations", async (t) => {
  const context = await httpFixture(t, { status: "PENDING", user: { id: "candidate-user", role: "CANDIDATE" } });
  const response = await context.request(`/jobs/${ids.job}/match-score?candidateId=candidate-b`);
  assert.equal(response.status, 200);
  assert.equal(typeof response.body.data.matchScore, "number");
  assert.ok(response.body.data.matchExplanation.length >= 3);
  assert.equal("candidateScore" in response.body.data, false);
  assert.equal(context.tables.matchScore[0].candidateId, context.candidate.id);
  assert.equal(context.calls.some((call) => call.model === "recruiter"), false);
});

for (const role of ["CANDIDATE", "ADMIN", "SUPER_ADMIN"]) {
  test(`preserves the existing stage endpoint restriction for ${role}`, async (t) => {
    const context = await httpFixture(t, { user: { role } });
    const response = await context.request(`/applications/${ids.application}/stage`, {
      method: "POST", body: { newStatus: "SCREENING", reason: "Review" }
    });
    assert.equal(response.status, 403);
    assert.deepEqual(context.calls.map((call) => call.model), ["user"]);
  });
}

test("registration schemas reject client-supplied roles, ownership and approval", () => {
  const context = fixture();
  const { registerRecruiterSchema, registerCandidateSchema } = context.load("modules/auth/auth.validation.ts");
  const credentials = { name: "Test User", email: "test@example.test", password: "test-password-only" };
  for (const extra of [{ role: "ADMIN" }, { companyId: "company-b" }, { recruiterId: "other" }, { verificationStatus: "APPROVED" }]) {
    assert.equal(registerRecruiterSchema.safeParse({ ...credentials, companyName: "Test Company", ...extra }).success, false);
    assert.equal(registerCandidateSchema.safeParse({ ...credentials, consentAccepted: true, ...extra }).success, false);
  }
});

test("the isolated query fake filters relation ownership and respects selected fields", () => {
  const record = { id: "app", job: { companyId: "a" }, candidate: { email: "private@example.test" } };
  assert.equal(matches(record, { id: "app", job: { companyId: "a" } }), true);
  assert.equal(matches(record, { id: "app", job: { companyId: "b" } }), false);
  assert.equal(matches(record, { id: undefined }), false);
  assert.deepEqual(project(record, { id: true, job: { select: { companyId: true } } }), { id: "app", job: { companyId: "a" } });
});
