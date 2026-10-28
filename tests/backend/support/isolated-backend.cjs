const { readFileSync } = require("node:fs");
const { createRequire } = require("node:module");
const path = require("node:path");
const { compileFunction } = require("node:vm");
const ts = require("typescript");

const sourceRoot = path.resolve(__dirname, "../../../src");
const compiled = new Map();

// Load real backend code with per-test dependencies, without loading .env or a DB client.
function isolatedBackend(prisma) {
  const cache = new Map();
  const env = Object.freeze({ JWT_SECRET: "isolated-authorization-test-only", JWT_EXPIRES_IN: "1h" });
  const allowedPackages = new Set(["@prisma/client", "express", "jsonwebtoken", "zod", "crypto"]);

  function load(filename) {
    if (filename === path.join(sourceRoot, "config/prisma.ts")) return { default: prisma, __esModule: true };
    if (filename === path.join(sourceRoot, "config/env.ts")) return { env };
    if (!filename.startsWith(sourceRoot + path.sep) || !filename.endsWith(".ts")) {
      throw new Error(`Unexpected backend import: ${filename}`);
    }
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const nativeRequire = createRequire(filename);
    const localRequire = (specifier) => {
      if (specifier.startsWith(".")) return load(path.resolve(path.dirname(filename), specifier + ".ts"));
      if (!allowedPackages.has(specifier)) throw new Error(`Unexpected dependency: ${specifier}`);
      const dependency = nativeRequire(specifier);
      if (specifier !== "@prisma/client") return dependency;
      return {
        ...dependency,
        PrismaClient: class {
          constructor() { throw new Error("Database clients are forbidden in authorization tests."); }
        }
      };
    };
    if (!compiled.has(filename)) {
      const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
      });
      compiled.set(filename, compileFunction(outputText, ["exports", "require", "module"], { filename }));
    }
    compiled.get(filename)(module.exports, localRequire, module);
    return module.exports;
  }

  return { load: (relativePath) => load(path.join(sourceRoot, relativePath)), env };
}

module.exports = { isolatedBackend };
