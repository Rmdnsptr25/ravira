const assert = require("node:assert/strict");
const { once } = require("node:events");
const { test } = require("node:test");

const app = require("../../dist/app").default;

const withServer = async (callback) => {
  const server = app.listen(0);
  await once(server, "listening");
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  try {
    await callback(baseUrl);
  } finally {
    server.close();
  }
};

test("Security headers are present and X-Powered-By is disabled", async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("x-powered-by"), null);
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.equal(res.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  });
});

test("Malformed JSON payload returns 400 without leaking stack trace", async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad-json"
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.deepEqual(body, {
      success: false,
      message: "Invalid JSON payload.",
      data: null
    });
  });
});

test("Unknown route returns structured 404 without stack trace", async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/v1/nonexistent-security-probe`);
    assert.equal(res.status, 404);
    const text = await res.text();
    assert.equal(text.includes("Error:"), false);
    assert.equal(text.includes("node_modules"), false);
  });
});
