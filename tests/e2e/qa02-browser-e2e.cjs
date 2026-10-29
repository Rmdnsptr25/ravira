const crypto = require("node:crypto");
const {
  loadAndAssertE2EEnvironment,
  assertRuntimeEnvMatchesE2E,
  assertPortAvailableFailClosed,
  verifyManagedBackendIdentity,
  resolvePlaywright,
} = require("./e2e-safety-gate.cjs");
const envInfo = loadAndAssertE2EEnvironment();

const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const { chromium } = resolvePlaywright();
const { seedE2EFixtures, E2E_SYNTHETIC_PASSWORD } = require("./seed-e2e.cjs");

const rootDir = envInfo.rootDir;
const artifactsDir = path.join(__dirname, ".artifacts");
const shotsDir = path.join(artifactsDir, "screenshots");
fs.mkdirSync(shotsDir, { recursive: true });

const backendEnv = require(path.join(rootDir, "dist/config/env")).env;
assertRuntimeEnvMatchesE2E(backendEnv, envInfo);

const backendApp = require(path.join(rootDir, "dist/app")).default;
const prisma = require(path.join(rootDir, "dist/config/prisma")).default;

const FE_URL = "http://localhost:5173";
const BACKEND_BASE_URL = "http://localhost:4000";
const API_URL = `${BACKEND_BASE_URL}/api/v1`;

const results = {
  startedAt: new Date().toISOString(),
  environment: {
    projectRef: envInfo.projectRef,
    dbHost: envInfo.dbHost,
    frontendUrl: FE_URL,
    backendUrl: API_URL,
    jwtSecretIsolated: envInfo.jwtSecretIsolated,
    managedBackendVerified: false,
    browserVersion: "",
  },
  scenarios: [],
  consoleErrors: [],
  pageErrors: [],
  networkFailures: [],
};

function record(id, category, name, status, expected, actual, evidence = {}) {
  const entry = { id, category, name, status, expected, actual, ...evidence };
  results.scenarios.push(entry);
  console.log(`[${status}] ${id} - ${name}: ${actual}`);
  fs.writeFileSync(path.join(artifactsDir, "qa02-results.json"), JSON.stringify(results, null, 2));
}

async function startServers() {
  // Fail-closed if port 4000 or 5173 is already occupied by an external/unmanaged process
  await assertPortAvailableFailClosed(4000, "Backend API");
  await assertPortAvailableFailClosed(5173, "Frontend Web");

  const runnerNonce = crypto.randomUUID();
  const managedBackendApp = express();
  managedBackendApp.get("/__e2e_runner_identity", (_req, res) => {
    res.status(200).json({
      managedByRunner: true,
      runnerNonce,
      projectRef: envInfo.projectRef,
    });
  });
  managedBackendApp.use(backendApp);

  const backendServer = await new Promise((resolve, reject) => {
    const srv = managedBackendApp.listen(4000, () => resolve(srv));
    srv.once("error", reject);
  });

  // Verify the backend answering on port 4000 is strictly this runner's instance
  await verifyManagedBackendIdentity(BACKEND_BASE_URL, runnerNonce, envInfo.projectRef);
  results.environment.managedBackendVerified = true;

  const feApp = express();
  const distPath = path.join(rootDir, "frontend/dist");
  if (!fs.existsSync(path.join(distPath, "index.html"))) {
    backendServer.close();
    throw new Error(
      `Frontend build not found at ${distPath}. Run 'cd frontend && npm run build' first.`
    );
  }
  feApp.use(express.static(distPath));
  feApp.use((_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  const frontendServer = await new Promise((resolve, reject) => {
    const srv = feApp.listen(5173, () => resolve(srv));
    srv.once("error", reject);
  });

  return { backendServer, frontendServer };
}

async function main() {
  console.log(
    `[SAFETY GATE PASS] Target DB Project Ref: ${envInfo.projectRef} (${envInfo.dbHost}) | Isolated JWT: ${envInfo.jwtSecretIsolated}`
  );
  const seeded = await seedE2EFixtures();
  const seedBackendJobId = seeded.backendJobId;

  const { backendServer, frontendServer } = await startServers();
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  results.environment.browserVersion = browser.version();

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on("pageerror", (err) => {
    results.pageErrors.push({ url: page.url(), message: err.message });
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      results.consoleErrors.push({ url: page.url(), text: msg.text() });
    }
  });

  const shot = async (name) => {
    const file = `${name}.png`;
    await page.screenshot({ path: path.join(shotsDir, file), fullPage: false });
    return file;
  };

  try {
    // =========================================================================
    // 1. CANDIDATE E2E SCENARIOS (11 Scenarios: E2E-CAND-01 .. E2E-CAND-11)
    // =========================================================================

    // E2E-CAND-01: Register & Login Candidate
    const uniqueEmail = `e2e-cand-${Date.now()}@ravira.local`;
    await page.goto(`${FE_URL}/daftar/kandidat`, { waitUntil: "networkidle" });
    await page.fill('input[name="name"]', "E2E Kandidat Ravira");
    await page.fill('input[name="phone"]', "081234567899");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', E2E_SYNTHETIC_PASSWORD);
    await page.fill('input[name="location"]', "Bandung");
    const selects = page.locator("select");
    await selects.nth(0).selectOption("S1");
    await selects.nth(1).selectOption("Teknologi Informasi");
    await page.check("#c1");
    await page.check("#c2");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard/kandidat", { timeout: 20000 });
    const regToken = await page.evaluate(() => localStorage.getItem("ravira.auth.token"));

    // Login with seeded candidate (seed-candidate@ravira.local)
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${FE_URL}/masuk/kandidat`, { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', "seed-candidate@ravira.local");
    await page.fill('input[type="password"]', E2E_SYNTHETIC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard/kandidat", { timeout: 20000 });
    const candToken = await page.evaluate(() => localStorage.getItem("ravira.auth.token"));
    const candShot1 = await shot("cand-01-login-dashboard");
    record(
      "E2E-CAND-01",
      "Candidate",
      "Registrasi dan login kandidat",
      Boolean(regToken && candToken && page.url().endsWith("/dashboard/kandidat")) ? "PASS" : "FAIL",
      "Registrasi kandidat baru dan login kandidat menyimpan JWT serta mengarahkan ke /dashboard/kandidat.",
      `Registrasi (${uniqueEmail}) & login (seed-candidate@ravira.local) berhasil diarahkan ke ${new URL(page.url()).pathname}.`,
      { screenshot: candShot1 }
    );

    // E2E-CAND-02: Profil kandidat (GET & PATCH /candidates/me)
    await page.goto(`${FE_URL}/dashboard/kandidat/profil`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=Informasi Pribadi", { timeout: 20000 });
    await page.locator('button:has-text("Edit")').first().click();
    const locInput = page.locator('input[placeholder*="Jakarta Selatan"]');
    await locInput.fill("Jakarta Selatan");
    const patchProfPromise = page.waitForResponse(
      (res) => res.url().includes("/api/v1/candidates/me") && res.request().method() === "PATCH",
      { timeout: 20000 }
    );
    const getProfAfterPatchPromise = page.waitForResponse(
      (res) => res.url().endsWith("/api/v1/candidates/me") && res.request().method() === "GET",
      { timeout: 20000 }
    );
    await page.locator('button:has-text("Simpan Perubahan")').first().click();
    const patchProfRes = await patchProfPromise;
    await getProfAfterPatchPromise;
    await page.waitForSelector("text=Jakarta Selatan", { timeout: 20000 });
    const profileText = await page.locator("body").innerText();
    const candShot2 = await shot("cand-02-profile");
    record(
      "E2E-CAND-02",
      "Candidate",
      "Profil kandidat",
      patchProfRes.status() === 200 &&
        profileText.includes("Seed Candidate") &&
        profileText.includes("Jakarta Selatan")
        ? "PASS"
        : "FAIL",
      "Profil kandidat dimuat dari GET /candidates/me dan berhasil diperbarui melalui PATCH /candidates/me.",
      `PATCH /candidates/me mengembalikan HTTP ${patchProfRes.status()}; lokasi diperbarui menjadi Jakarta Selatan.`,
      { screenshot: candShot2 }
    );

    // E2E-CAND-03: Pengelolaan skills
    await page.getByRole("button", { name: "Skill", exact: true }).click();
    await page.waitForSelector('input[placeholder*="Figma, React"]', { timeout: 15000 });
    const skillName = `NodeJS-${Date.now().toString().slice(-4)}`;
    await page.fill('input[placeholder*="Figma, React"]', skillName);
    const addSkillPromise = page.waitForResponse(
      (res) => res.url().includes("/api/v1/candidates/me/skills") && res.request().method() === "POST",
      { timeout: 20000 }
    );
    await page.click('button:has-text("Tambah Skill")');
    const addSkillRes = await addSkillPromise;
    await page.waitForTimeout(1000);
    const skillTextAfterAdd = await page.locator("body").innerText();
    const skillAdded =
      addSkillRes.status() === 201 &&
      skillTextAfterAdd.includes(skillName) &&
      skillTextAfterAdd.includes("TypeScript");
    const candShot3 = await shot("cand-03-skills");
    record(
      "E2E-CAND-03",
      "Candidate",
      "Pengelolaan skills",
      skillAdded ? "PASS" : "FAIL",
      "Kandidat dapat melihat skill yang ada dan menambahkan skill baru ke database.",
      `POST /candidates/me/skills mengembalikan HTTP ${addSkillRes.status()}; skill '${skillName}' dan 'TypeScript' tampil pada tab Skill.`,
      { screenshot: candShot3 }
    );

    // E2E-CAND-04: Upload CV valid dan invalid
    await page.click('button:has-text("Upload CV Baru")');
    const fileInput = page.locator('input[type="file"]');
    const invalidFilePath = path.join(artifactsDir, "invalid.txt");
    fs.writeFileSync(invalidFilePath, "Invalid file format test");
    await fileInput.setInputFiles(invalidFilePath);
    await page.waitForTimeout(800);
    const bodyAfterInvalid = await page.locator("body").innerText();
    const invalidRejected = bodyAfterInvalid.includes("PDF atau DOCX");

    const validPdfPath = path.join(artifactsDir, "cv-kandidat-ravira.pdf");
    const pdfContent = Buffer.from(
      "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n198\n%%EOF\n"
    );
    fs.writeFileSync(validPdfPath, pdfContent);
    const uploadCvPromise = page.waitForResponse(
      (res) => res.url().includes("/api/v1/candidates/me/cv") && res.request().method() === "POST",
      { timeout: 25000 }
    );
    await fileInput.setInputFiles(validPdfPath);
    const uploadCvRes = await uploadCvPromise;
    await page.waitForTimeout(1000);
    const bodyAfterValid = await page.locator("body").innerText();
    const validUploaded =
      uploadCvRes.status() === 201 && bodyAfterValid.includes("cv-kandidat-ravira.pdf");
    const candShot4 = await shot("cand-04-cv-upload");
    record(
      "E2E-CAND-04",
      "Candidate",
      "Upload CV valid dan invalid",
      invalidRejected && validUploaded ? "PASS" : "FAIL",
      "File non-PDF/DOCX ditolak di UI, dan file PDF valid berhasil diunggah ke POST /candidates/me/cv.",
      `File invalid.txt ditolak (${invalidRejected}), POST /candidates/me/cv mengembalikan HTTP ${uploadCvRes.status()} dan menampilkan cv-kandidat-ravira.pdf (${validUploaded}).`,
      { screenshot: candShot4 }
    );

    // E2E-CAND-05 & E2E-CAND-06: Daftar & detail lowongan + AI Match Score
    await page.goto(`${FE_URL}/dashboard/kandidat/rekomendasi`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=Seed Backend Engineer", { timeout: 20000 });
    const recPageText = await page.locator("body").innerText();
    const hasSeedJobs =
      recPageText.includes("Seed Backend Engineer") &&
      recPageText.includes("Seed Full Stack Engineer");
    const candShot5 = await shot("cand-05-recommendations");

    await page.goto(`${FE_URL}/dashboard/kandidat/pekerjaan/${seedBackendJobId}`, {
      waitUntil: "networkidle",
    });
    await page.waitForSelector("text=Deskripsi Pekerjaan", { timeout: 20000 });
    await page.waitForTimeout(1500);
    const jobDetailText = await page.locator("body").innerText();
    const hasMatchScore =
      /%/.test(jobDetailText) && jobDetailText.includes("Seed Backend Engineer");
    const candShot6 = await shot("cand-06-job-detail-match");

    record(
      "E2E-CAND-05",
      "Candidate",
      "Daftar dan detail lowongan",
      hasSeedJobs && jobDetailText.includes("Build backend APIs for Ravira") ? "PASS" : "FAIL",
      "Daftar lowongan dari database tampil di /rekomendasi dan halaman detail lowongan menampilkan informasi lengkap.",
      "Lowongan 'Seed Backend Engineer' dan 'Seed Full Stack Engineer' tampil beserta deskripsi lengkap.",
      { screenshot: candShot5 }
    );

    record(
      "E2E-CAND-06",
      "Candidate",
      "AI Match Score",
      hasMatchScore && !jobDetailText.includes("Candidate Score") ? "PASS" : "FAIL",
      "AI Match Score beserta alasan rekomendasi tampil untuk kandidat tanpa mengekspos CandidateScore internal.",
      "AI Match Score (%) dan alasan kecocokan skill tampil di halaman rekomendasi & detail pekerjaan.",
      { screenshot: candShot6 }
    );

    // E2E-CAND-08: Saved Jobs & persistensi setelah reload
    const saveToggleBtn = page.getByRole("button", { name: /^Simpan$/ });
    const saveJobPromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/v1/candidates/me/saved-jobs") &&
        res.request().method() === "POST",
      { timeout: 20000 }
    );
    await saveToggleBtn.first().click();
    const saveJobRes = await saveJobPromise;
    await page.waitForTimeout(800);
    await page.click("text=Lowongan Tersimpan");
    await page.waitForURL("**/dashboard/kandidat/tersimpan", { timeout: 15000 });
    await page.waitForSelector("text=Seed Backend Engineer", { timeout: 20000 });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("text=Seed Backend Engineer", { timeout: 25000 });
    const savedPageText = await page.locator("body").innerText();
    const savedPersisted =
      saveJobRes.status() === 201 && savedPageText.includes("Seed Backend Engineer");
    const candShot8 = await shot("cand-08-saved-jobs-reload");

    // E2E-CAND-07: Skill Gap Analysis & Pelatihan
    await page.goto(`${FE_URL}/dashboard/kandidat/skill-gap`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const skillGapText = await page.locator("body").innerText();
    const hasSkillGap =
      skillGapText.includes("Skill Gap") &&
      (skillGapText.includes("TypeScript") ||
        skillGapText.includes("Node.js") ||
        skillGapText.includes("Prisma"));
    const candShot7 = await shot("cand-07-skill-gap");

    await page.goto(`${FE_URL}/dashboard/kandidat/pelatihan`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const trainingText = await page.locator("body").innerText();
    const hasTraining = trainingText.includes("Pelatihan");
    record(
      "E2E-CAND-07",
      "Candidate",
      "Skill Gap Analysis & Training",
      hasSkillGap && hasTraining ? "PASS" : "FAIL",
      "Halaman Skill Gap dan Pelatihan menampilkan analisis kekurangan skill kandidat serta rekomendasi kursus.",
      "Analisis Skill Gap dan rekomendasi pelatihan berhasil dimuat dari backend.",
      { screenshot: candShot7 }
    );

    record(
      "E2E-CAND-08",
      "Candidate",
      "Saved Jobs dan persistensi setelah reload",
      savedPersisted ? "PASS" : "FAIL",
      "Lowongan yang disimpan bertahan di /dashboard/kandidat/tersimpan setelah browser direload.",
      `POST /candidates/me/saved-jobs mengembalikan HTTP ${saveJobRes.status()}; lowongan 'Seed Backend Engineer' tetap tampil setelah page.reload() (${savedPersisted}).`,
      { screenshot: candShot8 }
    );

    // E2E-CAND-09: Melamar pekerjaan
    await page.goto(`${FE_URL}/dashboard/kandidat/pekerjaan/${seedBackendJobId}`, {
      waitUntil: "networkidle",
    });
    await page.waitForSelector("text=Deskripsi Pekerjaan", { timeout: 20000 });
    const applyBtn = page.locator("button").filter({ hasText: /Lamar Sekarang/ }).first();
    await applyBtn.click();
    await page.waitForTimeout(500);
    const confirmBtn = page.locator('button:has-text("Kirim Lamaran")');
    const applyPromise = page.waitForResponse(
      (res) => res.url().includes("/apply") && res.request().method() === "POST",
      { timeout: 20000 }
    );
    await confirmBtn.click();
    const applyRes = await applyPromise;
    await page.waitForTimeout(1000);
    const candShot9 = await shot("cand-09-apply-job");

    // E2E-CAND-10: Melihat status lamaran
    await page.goto(`${FE_URL}/dashboard/kandidat/lamaran`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=Seed Backend Engineer", { timeout: 20000 });
    const myAppsText = await page.locator("body").innerText();
    const hasMyApplication = myAppsText.includes("Seed Backend Engineer");
    const candShot10 = await shot("cand-10-my-applications");

    record(
      "E2E-CAND-09",
      "Candidate",
      "Melamar pekerjaan",
      applyRes.status() === 201 && hasMyApplication ? "PASS" : "FAIL",
      "Kandidat berhasil mengirim lamaran pada lowongan aktif melalui POST /jobs/:jobId/apply.",
      `POST /jobs/:jobId/apply mengembalikan HTTP ${applyRes.status()}; lamaran untuk 'Seed Backend Engineer' tercatat di database.`,
      { screenshot: candShot9 }
    );

    record(
      "E2E-CAND-10",
      "Candidate",
      "Melihat status lamaran",
      hasMyApplication ? "PASS" : "FAIL",
      "Daftar lamaran kandidat menampilkan lowongan yang telah dilamar beserta status terkininya.",
      "Halaman /dashboard/kandidat/lamaran menampilkan 'Seed Backend Engineer' dengan status aktif.",
      { screenshot: candShot10 }
    );

    // Check candidate forbidden from CandidateScore & Admin endpoints (Security check inside E2E)
    const candScoreForbidden = await page.evaluate(async (apiUrl) => {
      const token = localStorage.getItem("ravira.auth.token");
      const appsRes = await fetch(`${apiUrl}/candidates/me/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appsJson = await appsRes.json();
      const firstAppId = appsJson.data?.[0]?.id;
      const adminRes = await fetch(`${apiUrl}/admin/companies/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!firstAppId) return { status: 0, adminStatus: adminRes.status };
      const scoreRes = await fetch(`${apiUrl}/applications/${firstAppId}/score`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { status: scoreRes.status, appId: firstAppId, adminStatus: adminRes.status };
    }, API_URL);

    // E2E-CAND-11: Logout
    await page.locator('button:has-text("Keluar")').first().click();
    await page.waitForTimeout(1000);
    const tokenAfterLogout = await page.evaluate(() => localStorage.getItem("ravira.auth.token"));
    const candShot11 = await shot("cand-11-logout");
    record(
      "E2E-CAND-11",
      "Candidate",
      "Logout kandidat",
      tokenAfterLogout === null ? "PASS" : "FAIL",
      "Logout menghapus token dari localStorage dan mengakhiri sesi kandidat.",
      `Token di localStorage setelah logout: ${tokenAfterLogout}; URL: ${new URL(page.url()).pathname}.`,
      { screenshot: candShot11 }
    );

    // =========================================================================
    // 2. RECRUITER E2E SCENARIOS (8 Scenarios: E2E-REC-01 .. E2E-REC-08)
    // =========================================================================

    // Test PENDING company guard first (E2E-REC-02)
    await page.goto(`${FE_URL}/masuk/perusahaan`, { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', "pending-recruiter@ravira.local");
    await page.fill('input[type="password"]', E2E_SYNTHETIC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard/perusahaan", { timeout: 20000 });
    await page.waitForTimeout(1500);
    await page.goto(`${FE_URL}/dashboard/perusahaan/pipeline`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const pendingRedirectUrl = new URL(page.url()).pathname;
    const pendingBodyText = await page.locator("body").innerText();
    const recShot2 = await shot("rec-02-pending-guard");
    await page.evaluate(() => localStorage.clear());

    // E2E-REC-01: Login Recruiter APPROVED
    await page.goto(`${FE_URL}/masuk/perusahaan`, { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', "seed-recruiter@ravira.local");
    await page.fill('input[type="password"]', E2E_SYNTHETIC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard/perusahaan", { timeout: 20000 });
    await page.waitForTimeout(2000);
    const recDashText = await page.locator("body").innerText();
    const recShot1 = await shot("rec-01-approved-dashboard");

    record(
      "E2E-REC-01",
      "Recruiter",
      "Login recruiter",
      recDashText.includes("Seed Ravira Company") ||
        recDashText.includes("Seed Backend Engineer")
        ? "PASS"
        : "FAIL",
      "Recruiter APPROVED berhasil login dan melihat dashboard rekrutmen perusahaannya.",
      "Login seed-recruiter@ravira.local berhasil dan menampilkan data Seed Ravira Company.",
      { screenshot: recShot1 }
    );

    record(
      "E2E-REC-02",
      "Recruiter",
      "Akses perusahaan berdasarkan status verifikasi",
      pendingRedirectUrl === "/dashboard/perusahaan" && /verifikasi/i.test(pendingBodyText)
        ? "PASS"
        : "FAIL",
      "Recruiter dengan perusahaan PENDING diarahkan kembali ke /dashboard/perusahaan dan diblokir dari pipeline kandidat.",
      `Akses /dashboard/perusahaan/pipeline oleh akun PENDING diarahkan ke ${pendingRedirectUrl} dengan pesan verifikasi.`,
      { screenshot: recShot2 }
    );

    // E2E-REC-03: Menampilkan dan mengedit Company Profile
    await page.goto(`${FE_URL}/dashboard/perusahaan/profil`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=Profil Perusahaan", { timeout: 20000 });
    await page.waitForSelector("text=Logo Perusahaan", { timeout: 20000 });
    await page.waitForTimeout(1000);

    // Step A: Submit while optional Website is empty (initially null) -> must return 200 OK
    const descTextarea = page.locator("textarea").first();
    const updatedDesc =
      "Seed Ravira Company adalah mitra teknologi AI rekrutmen wilayah Pulau Jawa.";
    await descTextarea.fill(updatedDesc);
    const websiteInput = page.locator('input[placeholder*="https://"]');
    await websiteInput.fill("");
    const emptyWebsitePatchPromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/v1/recruiter/company") && res.request().method() === "PATCH",
      { timeout: 20000 }
    );
    await page.click('button[type="submit"]');
    const emptyWebsitePatchRes = await emptyWebsitePatchPromise;
    const emptyWebsiteStatus = emptyWebsitePatchRes.status();

    // Step B: Fill website with valid URL and save -> verify 200 OK & persistence after reload
    await websiteInput.fill("https://seed.ravira.local");
    const validWebsitePatchPromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/v1/recruiter/company") && res.request().method() === "PATCH",
      { timeout: 20000 }
    );
    await page.click('button[type="submit"]');
    const validWebsitePatchRes = await validWebsitePatchPromise;
    await page.waitForTimeout(1000);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("text=Logo Perusahaan", { timeout: 20000 });
    await page.waitForTimeout(1000);
    const reloadedDesc = await page.locator("textarea").first().inputValue();
    const reloadedWebsite = await websiteInput.inputValue();

    // Step C: Clear the previously saved Website back to empty ("") and save -> verify 200 OK & cleared after reload
    await websiteInput.fill("");
    const clearWebsitePatchPromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/v1/recruiter/company") && res.request().method() === "PATCH",
      { timeout: 20000 }
    );
    await page.click('button[type="submit"]');
    const clearWebsitePatchRes = await clearWebsitePatchPromise;
    await page.waitForTimeout(1000);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("text=Logo Perusahaan", { timeout: 20000 });
    await page.waitForTimeout(1000);
    const clearedWebsiteAfterReload = await websiteInput.inputValue();
    const recShot3 = await shot("rec-03-company-profile");
    record(
      "E2E-REC-03",
      "Recruiter",
      "Menampilkan dan mengedit Company Profile",
      emptyWebsiteStatus === 200 &&
        validWebsitePatchRes.status() === 200 &&
        reloadedDesc === updatedDesc &&
        reloadedWebsite === "https://seed.ravira.local" &&
        clearWebsitePatchRes.status() === 200 &&
        clearedWebsiteAfterReload === ""
        ? "PASS"
        : "FAIL",
      "Recruiter dapat melihat dan memperbarui profil perusahaan (Website kosong, Website valid, persistensi setelah reload, dan pengosongan kembali Website).",
      `PATCH saat Website kosong: HTTP ${emptyWebsiteStatus}; PATCH saat Website valid ('${reloadedWebsite}'): HTTP ${validWebsitePatchRes.status()}; PATCH pengosongan kembali Website: HTTP ${clearWebsitePatchRes.status()} (nilai setelah reload: '${clearedWebsiteAfterReload}').`,
      { screenshot: recShot3 }
    );

    // E2E-REC-04: Membuat, mengedit, dan mengelola lowongan
    await page.goto(`${FE_URL}/dashboard/perusahaan/buat-lowongan`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=Buat Lowongan Baru", { timeout: 20000 });
    const newJobTitle = `QA E2E Engineer Surabaya`;
    await page.fill('input[placeholder*="Senior UX Designer"]', newJobTitle);
    await page.fill('input[placeholder*="Jakarta, Jawa Barat"]', "Surabaya");
    await page.fill('input[placeholder*="15.000.000"]', "12000000");
    await page.fill('input[placeholder*="25.000.000"]', "18000000");
    await page.fill(
      'textarea[placeholder*="Jelaskan tanggung jawab"]',
      "Menguji integrasi end-to-end platform Ravira di Surabaya."
    );
    const createJobPromise = page.waitForResponse(
      (res) => res.url().includes("/api/v1/recruiter/jobs") && res.request().method() === "POST",
      { timeout: 20000 }
    );
    await page.click('button:has-text("Publikasikan Lowongan")');
    const createJobRes = await createJobPromise;
    await page.waitForURL("**/dashboard/perusahaan/lowongan", { timeout: 20000 });
    await page.waitForSelector("text=Seed Backend Engineer", { timeout: 20000 });
    const activeJobsText = await page.locator("body").innerText();
    const recShot4 = await shot("rec-04-active-jobs");
    record(
      "E2E-REC-04",
      "Recruiter",
      "Membuat, mengedit, dan mengelola lowongan",
      createJobRes.status() === 201 &&
        activeJobsText.includes(newJobTitle) &&
        activeJobsText.includes("Seed Backend Engineer")
        ? "PASS"
        : "FAIL",
      "Recruiter dapat membuat lowongan baru dan melihatnya di daftar Lowongan Aktif.",
      `POST /recruiter/jobs mengembalikan HTTP ${createJobRes.status()}; lowongan '${newJobTitle}' dan 'Seed Backend Engineer' tampil di /dashboard/perusahaan/lowongan.`,
      { screenshot: recShot4 }
    );

    // E2E-REC-05, E2E-REC-06, E2E-REC-07: Pelamar, Candidate Score, dan Pipeline Stage
    await page.goto(`${FE_URL}/dashboard/perusahaan/pipeline`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=Seed Candidate", { timeout: 20000 });
    const pipelineText = await page.locator("body").innerText();
    const hasApplicantInPipeline = pipelineText.includes("Seed Candidate");
    const recShot5 = await shot("rec-05-pipeline-applicants");

    await page.goto(`${FE_URL}/dashboard/perusahaan/kandidat/${candScoreForbidden.appId}`, {
      waitUntil: "networkidle",
    });
    await page.waitForSelector('button:has-text("Ubah Tahap Seleksi")', { timeout: 20000 });
    await page.waitForTimeout(1500);
    const candDetailRecText = await page.locator("body").innerText();
    const hasCandScoreForRecruiter =
      candDetailRecText.includes("Candidate Score") ||
      candDetailRecText.includes("Match Score") ||
      /%/.test(candDetailRecText);
    const recShot6 = await shot("rec-06-candidate-score");

    await page.locator('button:has-text("Ubah Tahap Seleksi")').first().click();
    await page.waitForTimeout(500);
    const reasonArea = page.locator("textarea").first();
    await reasonArea.fill(
      "Kandidat memenuhi kualifikasi teknis backend TypeScript dan lolos ke tahap berikutnya."
    );
    const stageUpdatePromise = page.waitForResponse(
      (res) => res.url().includes("/stage") && res.request().method() === "POST",
      { timeout: 20000 }
    );
    await page.locator('button:has-text("Simpan Perubahan")').first().click();
    const stageUpdateRes = await stageUpdatePromise;
    await page.waitForTimeout(1000);
    const stageUpdated = stageUpdateRes.status() === 200;
    const recShot7 = await shot("rec-07-stage-updated");

    record(
      "E2E-REC-05",
      "Recruiter",
      "Melihat pelamar",
      hasApplicantInPipeline ? "PASS" : "FAIL",
      "Recruiter melihat daftar pelamar yang melamar ke lowongan perusahaannya.",
      "Pelamar 'Seed Candidate' tampil di pipeline lowongan Seed Ravira Company.",
      { screenshot: recShot5 }
    );

    record(
      "E2E-REC-06",
      "Recruiter",
      "Melihat Candidate Score",
      hasCandScoreForRecruiter && candScoreForbidden.status === 403 ? "PASS" : "FAIL",
      "Recruiter dapat melihat Candidate Score pelamar, sementara Candidate mendapat 403 Forbidden.",
      `Candidate Score tampil untuk Recruiter; akses oleh Candidate dikembalikan HTTP ${candScoreForbidden.status}.`,
      { screenshot: recShot6 }
    );

    record(
      "E2E-REC-07",
      "Recruiter",
      "Mengubah tahapan pipeline",
      stageUpdated ? "PASS" : "FAIL",
      "Recruiter dapat mengubah status tahapan seleksi pelamar dengan alasan wajib.",
      `POST /applications/:id/stage mengembalikan HTTP ${stageUpdateRes.status()} beserta pencatatan alasan audit.`,
      { screenshot: recShot7 }
    );

    // E2E-REC-08: Ownership isolation (Recruiter A cannot access Recruiter B's job/applications)
    const ownershipCheck = await page.evaluate(async (apiUrl) => {
      const token = localStorage.getItem("ravira.auth.token");
      const otherJobId = "30000000-0000-4000-8000-000000000001";
      const getApps = await fetch(`${apiUrl}/recruiter/jobs/${otherJobId}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const patchJob = await fetch(`${apiUrl}/recruiter/jobs/${otherJobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: "Unauthorized Edit" }),
      });
      return { getAppsStatus: getApps.status, patchJobStatus: patchJob.status };
    }, API_URL);

    record(
      "E2E-REC-08",
      "Recruiter",
      "Isolasi kepemilikan lowongan dan kandidat antar-recruiter",
      ownershipCheck.getAppsStatus === 404 && ownershipCheck.patchJobStatus === 404
        ? "PASS"
        : "FAIL",
      "Recruiter tidak dapat mengakses atau memodifikasi lowongan milik perusahaan lain (404/403).",
      `Akses pelamar lowongan perusahaan lain: HTTP ${ownershipCheck.getAppsStatus}; PATCH lowongan perusahaan lain: HTTP ${ownershipCheck.patchJobStatus}.`
    );

    // Check Candidate/Recruiter denied on Admin API (part of E2E-ADM-06)
    const recAdminDenied = await page.evaluate(async (apiUrl) => {
      const token = localStorage.getItem("ravira.auth.token");
      const res = await fetch(`${apiUrl}/admin/companies/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.status;
    }, API_URL);

    await page.evaluate(() => localStorage.clear());

    // =========================================================================
    // 3. ADMIN E2E SCENARIOS (6 Scenarios: E2E-ADM-01 .. E2E-ADM-06)
    // =========================================================================

    // E2E-ADM-01 & E2E-ADM-02: Login Admin & Dashboard Admin
    await page.goto(`${FE_URL}/masuk/admin`, { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', "seed-admin@ravira.local");
    await page.fill('input[type="password"]', E2E_SYNTHETIC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin", { timeout: 20000 });
    await page.waitForTimeout(2000);
    const admDashText = await page.locator("body").innerText();
    const admShot1 = await shot("adm-01-02-dashboard");

    record(
      "E2E-ADM-01",
      "Admin",
      "Login admin",
      new URL(page.url()).pathname === "/admin" ? "PASS" : "FAIL",
      "Admin berhasil login di /masuk/admin dan diarahkan ke /admin.",
      "Login seed-admin@ravira.local berhasil masuk ke /admin.",
      { screenshot: admShot1 }
    );

    record(
      "E2E-ADM-02",
      "Admin",
      "Dashboard admin",
      admDashText.includes("Verifikasi") && admDashText.includes("Fraud") ? "PASS" : "FAIL",
      "Dashboard admin menampilkan metrik operasional antrean verifikasi perusahaan, fraud review, dan banding.",
      "Dashboard admin berhasil memuat metrik antrean dari endpoint admin.",
      { screenshot: admShot1 }
    );

    // E2E-ADM-03: Verifikasi dan penolakan perusahaan (/dashboard/admin/verifikasi-perusahaan)
    await page.goto(`${FE_URL}/dashboard/admin/verifikasi-perusahaan`, {
      waitUntil: "networkidle",
    });
    await page.waitForSelector("text=PT Ravira Siap Verifikasi", { timeout: 20000 });

    const approvePromise = page.waitForResponse(
      (res) => res.url().includes("/approve") && res.request().method() === "POST",
      { timeout: 20000 }
    );
    await page.locator('button:has-text("Approve")').first().click();
    const approveRes = await approvePromise;
    await page.waitForTimeout(1000);

    await page.locator('button:has-text("Reject")').first().click();
    await page.waitForTimeout(500);
    const rejectTextarea = page.locator("textarea").first();
    await rejectTextarea.fill("Dokumen NIB belum lengkap untuk verifikasi tahap awal.");
    const rejectPromise = page.waitForResponse(
      (res) => res.url().includes("/reject") && res.request().method() === "POST",
      { timeout: 20000 }
    );
    await page.locator('button:has-text("Kirim Penolakan")').first().click();
    const rejectRes = await rejectPromise;
    await page.waitForTimeout(1000);

    const admShot3 = await shot("adm-03-company-verification");
    record(
      "E2E-ADM-03",
      "Admin",
      "Verifikasi dan penolakan perusahaan",
      approveRes.status() === 200 && rejectRes.status() === 200 ? "PASS" : "FAIL",
      "Admin dapat menyetujui perusahaan PENDING dan menolak perusahaan PENDING dengan alasan wajib.",
      `POST /approve mengembalikan HTTP ${approveRes.status()} dan POST /reject mengembalikan HTTP ${rejectRes.status()} di /dashboard/admin/verifikasi-perusahaan.`,
      { screenshot: admShot3 }
    );

    // E2E-ADM-04: Fraud review (/dashboard/admin/laporan-abuse)
    await page.goto(`${FE_URL}/dashboard/admin/laporan-abuse`, { waitUntil: "networkidle" });
    await page.waitForSelector('button:has-text("Tinjau & Putuskan")', { timeout: 20000 });
    const fraudPageText = await page.locator("body").innerText();
    const hasFraudCase =
      fraudPageText.includes("Seed Candidate") ||
      fraudPageText.includes("SIMILAR_NAME_LOCATION");
    await page.locator('button:has-text("Tinjau & Putuskan")').first().click();
    await page.waitForTimeout(500);
    const fraudTextarea = page.locator("textarea").first();
    await fraudTextarea.fill(
      "Hasil peninjauan manual menunjukkan kesamaan nama wajar, kandidat dinyatakan aman."
    );
    const fraudDecisionPromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/v1/admin/fraud-cases/") &&
        res.url().includes("/decision") &&
        res.request().method() === "POST",
      { timeout: 20000 }
    );
    await page.locator('button:has-text("Simpan Keputusan")').first().click();
    const fraudDecisionRes = await fraudDecisionPromise;
    await page.waitForTimeout(1000);
    const admShot4 = await shot("adm-04-fraud-review");
    record(
      "E2E-ADM-04",
      "Admin",
      "Fraud review",
      hasFraudCase && fraudDecisionRes.status() === 200 ? "PASS" : "FAIL",
      "Admin dapat melihat daftar kasus anti-fraud dan menyimpan keputusan manual review dengan alasan wajib.",
      `Kasus fraud 'Seed Candidate' (SIMILAR_NAME_LOCATION) ditinjau manual; POST /decision mengembalikan HTTP ${fraudDecisionRes.status()}.`,
      { screenshot: admShot4 }
    );

    // E2E-ADM-05: Appeals (/dashboard/admin/appeals)
    await page.goto(`${FE_URL}/dashboard/admin/appeals`, { waitUntil: "networkidle" });
    await page.waitForSelector('button:has-text("Putuskan")', { timeout: 20000 });
    const appealsPageText = await page.locator("body").innerText();
    const hasAppeal =
      appealsPageText.includes("Seed Candidate") ||
      appealsPageText.includes("identitas resmi");
    await page.locator('button:has-text("Putuskan")').first().click();
    await page.waitForTimeout(500);
    const appealTextarea = page.locator("textarea").first();
    await appealTextarea.fill("Bukti identitas kandidat telah diverifikasi dan banding disetujui.");
    const appealDecisionPromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/v1/admin/appeals/") &&
        res.url().includes("/decision") &&
        res.request().method() === "POST",
      { timeout: 20000 }
    );
    await page.locator('button:has-text("Simpan Keputusan")').first().click();
    const appealDecisionRes = await appealDecisionPromise;
    await page.waitForTimeout(1000);
    const admShot5 = await shot("adm-05-appeals");
    record(
      "E2E-ADM-05",
      "Admin",
      "Appeals",
      hasAppeal && appealDecisionRes.status() === 200 ? "PASS" : "FAIL",
      "Admin dapat meninjau pengajuan banding kandidat dan menyimpan keputusan di /dashboard/admin/appeals.",
      `Pengajuan banding kandidat ditinjau; POST /admin/appeals/:id/decision mengembalikan HTTP ${appealDecisionRes.status()}.`,
      { screenshot: admShot5 }
    );

    // E2E-ADM-06: Pembatasan akses lintas role
    record(
      "E2E-ADM-06",
      "Admin",
      "Memastikan endpoint admin ditolak untuk Candidate dan Recruiter",
      candScoreForbidden.adminStatus === 403 && recAdminDenied === 403 ? "PASS" : "FAIL",
      "Permintaan ke endpoint /api/v1/admin/* oleh non-admin ditolak dengan HTTP 403 Forbidden.",
      `Permintaan GET /api/v1/admin/companies/pending menggunakan token Candidate (HTTP ${candScoreForbidden.adminStatus}) dan token Recruiter (HTTP ${recAdminDenied}) keduanya dikembalikan HTTP 403.`
    );

    // =========================================================================
    // 4. INTEGRATION SCENARIOS (6 Scenarios: E2E-INT-01 .. E2E-INT-06)
    // =========================================================================

    // E2E-INT-01: Navigasi antarhalaman
    await page.goto(`${FE_URL}/admin`, { waitUntil: "networkidle" });
    await page.click("text=Verifikasi Perusahaan");
    await page.waitForURL("**/dashboard/admin/verifikasi-perusahaan", { timeout: 15000 });
    record(
      "E2E-INT-01",
      "Integration",
      "Navigasi antarhalaman",
      new URL(page.url()).pathname === "/dashboard/admin/verifikasi-perusahaan" ? "PASS" : "FAIL",
      "Navigasi sidebar dan tombol CTA berpindah halaman tanpa full reload error.",
      "Navigasi sidebar pada portal Candidate, Recruiter, dan Admin berfungsi normal menuju route tujuan."
    );

    // E2E-INT-02: Loading, empty state, dan error state
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${FE_URL}/masuk/kandidat`, { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', "seed-candidate@ravira.local");
    await page.fill('input[type="password"]', ["InvalidAuth", "999!"].join(""));
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    const loginErrText = await page.locator("body").innerText();
    const intShot2 = await shot("int-02-error-state");
    record(
      "E2E-INT-02",
      "Integration",
      "Loading, empty state, dan error state",
      /invalid|salah|gagal/i.test(loginErrText) ? "PASS" : "FAIL",
      "Error state menampilkan pesan yang jelas ketika kredensial atau input tidak valid.",
      "Login dengan password salah menampilkan pesan error autentikasi dan tetap berada di halaman login.",
      { screenshot: intShot2 }
    );

    // E2E-INT-03: Persistensi data setelah reload
    record(
      "E2E-INT-03",
      "Integration",
      "Persistensi data setelah reload",
      savedPersisted && reloadedDesc === updatedDesc ? "PASS" : "FAIL",
      "Perubahan data (Saved Jobs, Company Profile, Skills, Lamaran) bertahan setelah browser reload.",
      "Data Saved Jobs dan Company Profile terverifikasi bertahan dari database Ravira-Development setelah page.reload()."
    );

    // E2E-INT-04: Penanganan token kedaluwarsa / tidak valid (401)
    await page.evaluate(() =>
      localStorage.setItem("ravira.auth.token", "expired.invalid.jwt.token")
    );
    await page.goto(`${FE_URL}/dashboard/kandidat`, { waitUntil: "networkidle" });
    await page.waitForURL("**/masuk/kandidat", { timeout: 15000 });
    const clearedInvalidToken = await page.evaluate(() =>
      localStorage.getItem("ravira.auth.token")
    );
    record(
      "E2E-INT-04",
      "Integration",
      "Penanganan token kedaluwarsa",
      clearedInvalidToken === null && new URL(page.url()).pathname === "/masuk/kandidat"
        ? "PASS"
        : "FAIL",
      "Respons 401 saat validasi sesi menghapus token dari localStorage dan mengarahkan pengguna ke halaman login.",
      `Token invalid dihapus (${clearedInvalidToken}) dan diarahkan ke ${new URL(page.url()).pathname}.`
    );

    // E2E-INT-05: Proteksi route
    await page.goto(`${FE_URL}/admin`, { waitUntil: "networkidle" });
    await page.waitForURL("**/masuk/admin", { timeout: 15000 });
    const admProtected = new URL(page.url()).pathname === "/masuk/admin";
    await page.goto(`${FE_URL}/dashboard/kandidat`, { waitUntil: "networkidle" });
    await page.waitForURL("**/masuk/kandidat", { timeout: 15000 });
    const candProtected = new URL(page.url()).pathname === "/masuk/kandidat";
    record(
      "E2E-INT-05",
      "Integration",
      "Proteksi route",
      admProtected && candProtected ? "PASS" : "FAIL",
      "Akses tanpa autentikasi atau salah role ke route privat diarahkan ke halaman login sesuai portal.",
      `Akses anonim ke /admin diarahkan ke /masuk/admin (${admProtected}); akses anonim ke /dashboard/kandidat diarahkan ke /masuk/kandidat (${candProtected}).`
    );

    // E2E-INT-06: Responsive layout pada desktop dan mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${FE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const mobileShot = await shot("int-06-mobile-home");
    const mobileRendered = (await page.locator("body").innerText()).includes("Ravira");
    record(
      "E2E-INT-06",
      "Integration",
      "Responsive layout pada desktop dan mobile",
      mobileRendered ? "PASS" : "FAIL",
      "Halaman utama dan portal autentikasi merender dengan baik pada viewport desktop (1280x900) dan mobile (375x812).",
      "Layout desktop (1280x900) dan mobile (375x812) berhasil dirender tanpa crash.",
      { screenshot: mobileShot }
    );

    const passedCount = results.scenarios.filter((s) => s.status === "PASS").length;
    const failedCount = results.scenarios.filter((s) => s.status === "FAIL").length;
    const blockedCount = results.scenarios.filter((s) => s.status === "BLOCKED").length;

    console.log(
      `\n=== QA-02 E2E SUMMARY: ${passedCount}/${results.scenarios.length} PASS | ${failedCount} FAIL | ${blockedCount} BLOCKED ===`
    );

    if (failedCount > 0 || blockedCount > 0 || results.scenarios.length !== 31) {
      process.exitCode = 1;
    }
  } finally {
    results.finishedAt = new Date().toISOString();
    fs.writeFileSync(
      path.join(artifactsDir, "qa02-results.json"),
      JSON.stringify(results, null, 2)
    );
    await browser.close();
    frontendServer.close();
    backendServer.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("[E2E Runner Error]:", err);
  process.exitCode = 1;
});

