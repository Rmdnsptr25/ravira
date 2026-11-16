const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { PrismaClient, Role } = require("@prisma/client");

dotenv.config({ quiet: true });

const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD || "");
const fullName = String(process.env.ADMIN_NAME || "RAVIRA Administrator").trim();
const requestedRole = String(process.env.ADMIN_ROLE || Role.ADMIN).trim().toUpperCase();

function validateInput() {
  if (![Role.ADMIN, Role.SUPER_ADMIN].includes(requestedRole)) {
    throw new Error("ADMIN_ROLE must be ADMIN or SUPER_ADMIN.");
  }

  const confirmation = `PROVISION_RAVIRA_${requestedRole}`;
  if (process.env.PROVISION_ADMIN_CONFIRM !== confirmation) {
    throw new Error(`Set PROVISION_ADMIN_CONFIRM=${confirmation} to confirm this privileged database change.`);
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_EMAIL must be a valid email address.");
  }

  const hasRequiredCharacters =
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);
  const weakTerms = /(admin|password|qwerty|ravira)/i;

  if (password.length < 14 || !hasRequiredCharacters || weakTerms.test(password)) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 14 characters and contain uppercase, lowercase, number, and symbol without common terms."
    );
  }

  if (!fullName) {
    throw new Error("ADMIN_NAME cannot be empty.");
  }
}

async function provisionAdmin() {
  validateInput();
  const prisma = new PrismaClient();

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, isActive: true },
    });

    if (existing && existing.role !== requestedRole) {
      throw new Error(
        `Refusing to change existing ${existing.role} account into ${requestedRole}. Use a dedicated email address.`
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.$transaction(async (tx) => {
      const user = existing
        ? await tx.user.update({
            where: { id: existing.id },
            data: { passwordHash, isActive: true },
            select: { id: true, email: true, role: true },
          })
        : await tx.user.create({
            data: {
              email,
              passwordHash,
              fullName,
              role: requestedRole,
              isActive: true,
            },
            select: { id: true, email: true, role: true },
          });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          actorRole: requestedRole,
          action: existing ? `${requestedRole}_CREDENTIAL_ROTATED` : `${requestedRole}_PROVISIONED`,
          entity: "User",
          entityId: user.id,
          reason: "Manual privileged account provisioning",
          severity: "HIGH",
          before: existing ? { role: existing.role, isActive: existing.isActive } : undefined,
          after: { role: requestedRole, isActive: true },
        },
      });

      return user;
    });

    console.log(`Admin account ready: ${admin.email} (${admin.role}). Password was not logged.`);
  } finally {
    await prisma.$disconnect();
  }
}

provisionAdmin().catch((error) => {
  console.error(`[Admin Provision Error]: ${error instanceof Error ? error.message : "Unknown error"}`);
  process.exitCode = 1;
});
