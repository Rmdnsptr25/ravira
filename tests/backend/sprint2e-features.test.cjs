const assert = require("node:assert/strict");
const { test } = require("node:test");
const { httpFixture } = require("./support/authorization-fixture.cjs");

test("Recruiter Company Profile: denies GET /recruiter/company to unauthenticated requests", async (t) => {
  const context = await httpFixture(t);
  const response = await context.request("/recruiter/company", {
    authorization: null
  });
  assert.equal(response.status, 401);
});

test("Recruiter Company Profile: denies GET /recruiter/company to CANDIDATE role", async (t) => {
  const context = await httpFixture(t, {
    user: { role: "CANDIDATE", id: "candidate-user" }
  });
  const response = await context.request("/recruiter/company");
  assert.equal(response.status, 403);
});

test("Recruiter Company Profile: allows GET /recruiter/company for RECRUITER and returns profile", async (t) => {
  const context = await httpFixture(t, {
    user: { role: "RECRUITER", id: "recruiter-user" }
  });
  const response = await context.request("/recruiter/company");
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.id, "company-a");
  assert.equal(response.body.data.name, "RAVIRA Test Company");
});

test("Recruiter Company Profile: PATCH /recruiter/company rejects empty request body", async (t) => {
  const context = await httpFixture(t, {
    user: { role: "RECRUITER", id: "recruiter-user" }
  });
  const response = await context.request("/recruiter/company", {
    method: "PATCH",
    body: {}
  });
  assert.equal(response.status, 400);
});

test("Recruiter Company Profile: PATCH /recruiter/company updates profile successfully", async (t) => {
  const context = await httpFixture(t, {
    user: { role: "RECRUITER", id: "recruiter-user" }
  });
  const response = await context.request("/recruiter/company", {
    method: "PATCH",
    body: {
      name: "RAVIRA Tech Updated",
      industry: "Software & AI",
      location: "Bandung, Jawa Barat",
      description: "Platform karir dan rekrutmen AI terdepan."
    }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.name, "RAVIRA Tech Updated");
});
