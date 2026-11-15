const fs = require("node:fs");
const path = require("node:path");
const {
  loadAndAssertE2EEnvironment,
  assertRuntimeEnvMatchesE2E,
  assertPortAvailableFailClosed,
} = require("../tests/e2e/e2e-safety-gate.cjs");

async function startDevE2EServer() {
  const envInfo = loadAndAssertE2EEnvironment();
  const rootDir = envInfo.rootDir;
  const distEnvPath = path.join(rootDir, "dist/config/env.js");
  const distAppPath = path.join(rootDir, "dist/app.js");
  const distPrismaPath = path.join(rootDir, "dist/config/prisma.js");

  if (!fs.existsSync(distEnvPath) || !fs.existsSync(distAppPath)) {
    throw new Error(
      `[DEV:E2E] Compiled backend not found at ${path.join(rootDir, "dist")}. Run "npm run build" first.`
    );
  }

  const backendEnv = require(distEnvPath).env;
  assertRuntimeEnvMatchesE2E(backendEnv, envInfo);

  const port = Number(backendEnv.PORT) || 4000;
  await assertPortAvailableFailClosed(port, "Ravira Development E2E Backend");

  const app = require(distAppPath).default;
  const prisma = fs.existsSync(distPrismaPath) ? require(distPrismaPath).default : null;

  const server = await new Promise((resolve, reject) => {
    const srv = app.listen(port, () => resolve(srv));
    srv.once("error", reject);
  });

  console.log(
    JSON.stringify(
      {
        status: "running",
        service: "ravira-backend-dev-e2e",
        port,
        projectRef: envInfo.projectRef,
        dbHost: envInfo.dbHost,
        jwtSecretIsolated: envInfo.jwtSecretIsolated,
      },
      null,
      2
    )
  );

  const shutdown = async (signal) => {
    console.log(`\n[DEV:E2E] Received ${signal}, shutting down cleanly...`);
    server.close();
    if (prisma && typeof prisma.$disconnect === "function") {
      await prisma.$disconnect().catch(() => {});
    }
    process.exit(0);
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));

  return { server, prisma, envInfo };
}

if (require.main === module) {
  startDevE2EServer().catch((error) => {
    console.error("[DEV:E2E Error]:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { startDevE2EServer };
