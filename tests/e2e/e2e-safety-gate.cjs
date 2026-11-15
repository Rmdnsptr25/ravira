const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const dotenv = require("dotenv");

const ALLOWED_DEV_PROJECT_REF = "rkftrtpcoymstbdtlfig";
const FORBIDDEN_PROD_PATTERNS = [
  "gsjonnybomydrfhsdwcc",
  "aws-1-ap-south-1.pooler.supabase.com",
];
const ALLOWED_DEV_NODE_ENVS = ["development", "test", "e2e"];
const FORBIDDEN_DEFAULT_PASSWORDS = [
  "Password123!",
  "password123!",
  "Password123",
  "password",
  "admin",
  "admin123",
  "12345678",
];
const DEV_SYNTHETIC_PASSWORD = ["TestUser", "123!"].join("");

let dotenvLockedToPath = null;
const originalDotenvConfig = dotenv.config.bind(dotenv);

function lockDotenvToE2EPath(envE2EPath) {
  dotenvLockedToPath = envE2EPath;
  dotenv.config = function lockedDotenvConfig(options = {}) {
    return originalDotenvConfig({
      ...options,
      path: dotenvLockedToPath,
      override: false,
      quiet: true,
    });
  };
}

function assertUrlTargetsDevOnly(urlValue, varName) {
  if (!urlValue || typeof urlValue !== "string" || !urlValue.trim()) {
    throw new Error(`[E2E SAFETY GATE BLOCKED] ${varName} is not defined.`);
  }

  for (const forbidden of FORBIDDEN_PROD_PATTERNS) {
    if (urlValue.includes(forbidden)) {
      throw new Error(
        `[E2E SAFETY GATE BLOCKED] ${varName} matches Production pattern (${forbidden}). Aborting immediately!`
      );
    }
  }

  if (!urlValue.includes(ALLOWED_DEV_PROJECT_REF)) {
    throw new Error(
      `[E2E SAFETY GATE BLOCKED] ${varName} does not target Supabase Ravira-Development (${ALLOWED_DEV_PROJECT_REF}). Aborting immediately!`
    );
  }
}

function resolveSafeDevSeedPassword(env = process.env) {
  const raw = env && env.SEED_PASSWORD !== undefined && env.SEED_PASSWORD !== ""
    ? String(env.SEED_PASSWORD)
    : DEV_SYNTHETIC_PASSWORD;

  if (FORBIDDEN_DEFAULT_PASSWORDS.includes(raw) || raw.length < 8) {
    throw new Error(
      "[SECURITY SAFETY GATE BLOCKED] SEED_PASSWORD uses a forbidden public default or weak credential. Aborting immediately!"
    );
  }

  return raw;
}

function assertDevelopmentSeedSafety(env = process.env, options = {}) {
  const scriptName = options.scriptName || "seed-script";
  const rawNodeEnv = env && env.NODE_ENV ? String(env.NODE_ENV).trim().toLowerCase() : "development";

  if (!ALLOWED_DEV_NODE_ENVS.includes(rawNodeEnv)) {
    throw new Error(
      `[SECURITY SAFETY GATE BLOCKED] ${scriptName} is forbidden when NODE_ENV="${rawNodeEnv}". ` +
        `Allowed environments: ${ALLOWED_DEV_NODE_ENVS.join(", ")}. Aborting before database connection!`
    );
  }

  const dbUrl = env && env.DATABASE_URL ? String(env.DATABASE_URL).trim() : "";
  if (!dbUrl) {
    throw new Error(
      `[SECURITY SAFETY GATE BLOCKED] ${scriptName} requires DATABASE_URL targeting Ravira-Development (${ALLOWED_DEV_PROJECT_REF}). Aborting before database connection!`
    );
  }

  assertUrlTargetsDevOnly(dbUrl, "DATABASE_URL");

  if (env && env.DIRECT_URL) {
    assertUrlTargetsDevOnly(String(env.DIRECT_URL).trim(), "DIRECT_URL");
  }

  const seedPassword = resolveSafeDevSeedPassword(env);

  let parsedUrl;
  try {
    parsedUrl = new URL(dbUrl);
  } catch {
    parsedUrl = { hostname: "unknown", port: "5432", pathname: "/postgres" };
  }

  return {
    scriptName,
    nodeEnv: rawNodeEnv,
    projectRef: ALLOWED_DEV_PROJECT_REF,
    dbHost: parsedUrl.hostname,
    dbPort: parsedUrl.port || "5432",
    seedPassword,
  };
}

function loadDevelopmentEnvForScript(options = {}) {
  const rootDir = options.rootDir || path.resolve(__dirname, "../..");
  const explicitPath = process.env.DOTENV_CONFIG_PATH
    ? path.resolve(process.env.DOTENV_CONFIG_PATH)
    : null;

  // If DATABASE_URL is not already injected into process.env, load from explicit path, .env.e2e, or .env
  if (!process.env.DATABASE_URL) {
    const candidatePath =
      explicitPath ||
      (fs.existsSync(path.join(rootDir, ".env.e2e"))
        ? path.join(rootDir, ".env.e2e")
        : path.join(rootDir, ".env"));

    if (fs.existsSync(candidatePath)) {
      originalDotenvConfig({ path: candidatePath, override: false, quiet: true });
    }
  }

  return assertDevelopmentSeedSafety(process.env, options);
}

function loadAndAssertE2EEnvironment() {
  const rootDir = path.resolve(__dirname, "../..");
  const envE2EPath = process.env.DOTENV_CONFIG_PATH
    ? path.resolve(process.env.DOTENV_CONFIG_PATH)
    : path.join(rootDir, ".env.e2e");

  if (!fs.existsSync(envE2EPath)) {
    throw new Error(
      `[E2E SAFETY GATE BLOCKED] Missing .env.e2e file at ${envE2EPath}. ` +
        `Create .env.e2e pointing strictly to Ravira-Development (${ALLOWED_DEV_PROJECT_REF}).`
    );
  }

  const e2eParsed = dotenv.parse(fs.readFileSync(envE2EPath, "utf8"));

  // Prevent any ambient DIRECT_URL from parent environment if not explicitly in .env.e2e
  if (!e2eParsed.DIRECT_URL) {
    delete process.env.DIRECT_URL;
  }

  for (const [key, value] of Object.entries(e2eParsed)) {
    process.env[key] = value;
  }

  process.env.DOTENV_CONFIG_PATH = envE2EPath;
  lockDotenvToE2EPath(envE2EPath);

  assertDevelopmentSeedSafety(process.env, { scriptName: "e2e-runner" });

  const dbUrl = process.env.DATABASE_URL || "";
  assertUrlTargetsDevOnly(dbUrl, "DATABASE_URL");

  if (process.env.DIRECT_URL) {
    assertUrlTargetsDevOnly(process.env.DIRECT_URL, "DIRECT_URL");
  }

  const jwtSecret = process.env.JWT_SECRET || "";
  if (!jwtSecret || !jwtSecret.startsWith("ravira-dev-e2e-") || jwtSecret.length < 24) {
    throw new Error(
      "[E2E SAFETY GATE BLOCKED] JWT_SECRET must be an isolated E2E secret starting with 'ravira-dev-e2e-' (min 24 chars)."
    );
  }

  // Ensure DATABASE_URL and JWT_SECRET are strictly distinct from .env Production if .env exists
  const prodEnvPath = path.join(rootDir, ".env");
  if (fs.existsSync(prodEnvPath)) {
    const prodParsed = dotenv.parse(fs.readFileSync(prodEnvPath, "utf8"));
    if (prodParsed.JWT_SECRET && prodParsed.JWT_SECRET === jwtSecret) {
      throw new Error(
        "[E2E SAFETY GATE BLOCKED] JWT_SECRET in .env.e2e must be distinct from .env Production."
      );
    }
    if (prodParsed.DATABASE_URL && prodParsed.DATABASE_URL === dbUrl) {
      throw new Error(
        "[E2E SAFETY GATE BLOCKED] DATABASE_URL in .env.e2e is identical to .env Production. Aborting!"
      );
    }
    if (prodParsed.DIRECT_URL && prodParsed.DIRECT_URL === dbUrl) {
      throw new Error(
        "[E2E SAFETY GATE BLOCKED] DATABASE_URL in .env.e2e matches DIRECT_URL in .env Production. Aborting!"
      );
    }
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(dbUrl);
  } catch {
    parsedUrl = { hostname: "unknown", port: "unknown", pathname: "/postgres" };
  }

  return {
    rootDir,
    envE2EPath,
    projectRef: ALLOWED_DEV_PROJECT_REF,
    dbHost: parsedUrl.hostname,
    dbPort: parsedUrl.port || "5432",
    databaseUrl: dbUrl,
    jwtSecret,
    jwtSecretIsolated: true,
  };
}

function assertRuntimeEnvMatchesE2E(runtimeEnv, envInfo) {
  if (!runtimeEnv || typeof runtimeEnv !== "object") {
    throw new Error("[E2E SAFETY GATE BLOCKED] Backend runtime env object is missing.");
  }
  assertUrlTargetsDevOnly(runtimeEnv.DATABASE_URL, "runtimeEnv.DATABASE_URL");
  if (runtimeEnv.DATABASE_URL !== envInfo.databaseUrl) {
    throw new Error(
      "[E2E SAFETY GATE BLOCKED] Backend runtime DATABASE_URL does not match .env.e2e DATABASE_URL. Aborting!"
    );
  }
  if (runtimeEnv.JWT_SECRET !== envInfo.jwtSecret) {
    throw new Error(
      "[E2E SAFETY GATE BLOCKED] Backend runtime JWT_SECRET does not match .env.e2e JWT_SECRET. Aborting!"
    );
  }
}

function probeHostPortInUse(host, port, timeoutMs = 600) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (inUse) => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(inUse);
      }
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => {
      finish(false);
    });
    socket.connect(port, host);
  });
}

async function assertPortAvailableFailClosed(port, serviceName) {
  const hostsToProbe = ["127.0.0.1", "::1", "localhost"];
  for (const host of hostsToProbe) {
    const inUse = await probeHostPortInUse(host, port);
    if (inUse) {
      throw new Error(
        `[E2E SAFETY GATE BLOCKED] Port ${port} (${host}) is already occupied by an unmanaged external process (${serviceName}). ` +
          `Fail-closed policy prohibits reusing an unverified process on port ${port}. Stop the process on port ${port} before running E2E.`
      );
    }
  }
}

async function verifyManagedBackendIdentity(baseUrl, expectedNonce, expectedProjectRef) {
  const res = await fetch(`${baseUrl}/__e2e_runner_identity`);
  if (res.status !== 200) {
    throw new Error(
      `[E2E SAFETY GATE BLOCKED] Backend on ${baseUrl} did not respond with managed runner identity (HTTP ${res.status}). Fail-closed abort!`
    );
  }
  const body = await res.json();
  if (
    !body ||
    body.managedByRunner !== true ||
    body.runnerNonce !== expectedNonce ||
    body.projectRef !== expectedProjectRef
  ) {
    throw new Error(
      "[E2E SAFETY GATE BLOCKED] Backend on port 4000 failed runner nonce/projectRef verification. Fail-closed abort!"
    );
  }
}

function resolvePlaywright() {
  const candidates = ["playwright", "@playwright/test"];

  for (const modPath of candidates) {
    try {
      return require(modPath);
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    "Playwright is not installed in node_modules. Run `npm ci` or `npm install` first."
  );
}

module.exports = {
  ALLOWED_DEV_PROJECT_REF,
  FORBIDDEN_PROD_PATTERNS,
  ALLOWED_DEV_NODE_ENVS,
  FORBIDDEN_DEFAULT_PASSWORDS,
  DEV_SYNTHETIC_PASSWORD,
  assertUrlTargetsDevOnly,
  resolveSafeDevSeedPassword,
  assertDevelopmentSeedSafety,
  loadDevelopmentEnvForScript,
  loadAndAssertE2EEnvironment,
  assertRuntimeEnvMatchesE2E,
  assertPortAvailableFailClosed,
  verifyManagedBackendIdentity,
  resolvePlaywright,
};
