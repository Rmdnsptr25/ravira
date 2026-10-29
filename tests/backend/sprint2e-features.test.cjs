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
      website: "https://ravira.local",
      description: "Platform karir dan rekrutmen AI terdepan."
    }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.name, "RAVIRA Tech Updated");
  assert.equal(response.body.data.website, "https://ravira.local");
});

test("Recruiter Company Profile: PATCH /recruiter/company allows empty/null website to clear existing website and rejects invalid URL", async (t) => {
  const context = await httpFixture(t, {
    user: { role: "RECRUITER", id: "recruiter-user" }
  });

  // First set a valid website
  const setRes = await context.request("/recruiter/company", {
    method: "PATCH",
    body: {
      name: "RAVIRA Tech",
      website: "https://ravira.local"
    }
  });
  assert.equal(setRes.status, 200);
  assert.equal(setRes.body.data.website, "https://ravira.local");

  // Clear website using null
  const clearNullRes = await context.request("/recruiter/company", {
    method: "PATCH",
    body: {
      name: "RAVIRA Tech",
      website: null
    }
  });
  assert.equal(clearNullRes.status, 200);
  assert.equal(clearNullRes.body.data.website, null);

  // Set again, then clear using empty string ""
  await context.request("/recruiter/company", {
    method: "PATCH",
    body: { website: "https://ravira.local" }
  });
  const clearEmptyRes = await context.request("/recruiter/company", {
    method: "PATCH",
    body: {
      name: "RAVIRA Tech",
      website: ""
    }
  });
  assert.equal(clearEmptyRes.status, 200);
  assert.equal(clearEmptyRes.body.data.website, null);

  // Invalid website URL should be rejected with 400
  const invalidUrlRes = await context.request("/recruiter/company", {
    method: "PATCH",
    body: {
      website: "not-a-valid-url"
    }
  });
  assert.equal(invalidUrlRes.status, 400);
});
