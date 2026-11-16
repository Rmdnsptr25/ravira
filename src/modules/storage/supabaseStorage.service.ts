import { env } from "../../config/env";

const ALLOWED_LOGO_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

export const isSupabaseStorageConfigured = (): boolean => {
  return (
    (env.SUPABASE_URL ?? "").trim().length > 0 &&
    (env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim().length > 0
  );
};

const MIME_FALLBACK_MAP: Record<string, string> = {
  "application/pdf": "doc/pdf",
  "image/jpeg": "image/jpg"
};

const sendSupabaseUpload = async (
  targetUrl: string,
  serviceKey: string,
  buffer: Buffer,
  contentType: string,
  timeoutMs: number
): Promise<number> => {
  const https = await import("https");
  return new Promise<number>((resolve, reject) => {
    const req = https.default.request(
      targetUrl,
      {
        method: "POST",
        family: 4,
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": contentType,
          "Content-Length": String(buffer.length),
          "x-upsert": "true"
        }
      },
      (res) => {
        res.resume();
        res.on("end", () => resolve(res.statusCode ?? 0));
      }
    );

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("Supabase Storage upload timed out"));
    });
    req.on("error", reject);
    req.write(buffer);
    req.end();
  });
};

export const uploadBufferToSupabaseStorage = async (options: {
  bucket: string;
  objectPath: string;
  buffer: Buffer;
  contentType: string;
  timeoutMs?: number;
}): Promise<string | null> => {
  const supabaseUrl = (env.SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
  const serviceKey = (env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  const normalizedObjectPath = options.objectPath.replace(/^\/+/, "");
  const targetUrl = `${supabaseUrl}/storage/v1/object/${encodeURIComponent(options.bucket)}/${normalizedObjectPath}`;
  const timeoutMs = options.timeoutMs ?? 15000;

  try {
    let statusCode = await sendSupabaseUpload(
      targetUrl,
      serviceKey,
      options.buffer,
      options.contentType,
      timeoutMs
    );

    if ((statusCode === 400 || statusCode === 415) && MIME_FALLBACK_MAP[options.contentType]) {
      statusCode = await sendSupabaseUpload(
        targetUrl,
        serviceKey,
        options.buffer,
        MIME_FALLBACK_MAP[options.contentType],
        timeoutMs
      );
    }

    if (statusCode < 200 || statusCode >= 300) {
      return null;
    }

    return `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(options.bucket)}/${normalizedObjectPath}`;
  } catch {
    return null;
  }
};

export const findLocalCompanyLogoUrl = async (companyId: string): Promise<string | null> => {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "uploads", "company-logos");

    for (const ext of ALLOWED_LOGO_EXTENSIONS) {
      const fileName = `${companyId}${ext}`;
      const fullPath = path.join(uploadDir, fileName);
      try {
        const stats = await fs.stat(fullPath);
        return `/uploads/company-logos/${fileName}?v=${Math.floor(stats.mtimeMs)}`;
      } catch {
        // File with this extension does not exist; check next.
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const saveLocalCompanyLogo = async (
  companyId: string,
  originalName: string,
  buffer: Buffer
): Promise<string> => {
  const fs = await import("fs/promises");
  const path = await import("path");
  const uploadDir = path.join(process.cwd(), "uploads", "company-logos");
  const extension = path.extname(originalName).toLowerCase() || ".png";
  const fileName = `${companyId}${extension}`;
  const targetPath = path.join(uploadDir, fileName);

  await fs.mkdir(uploadDir, { recursive: true });
  for (const oldExt of ALLOWED_LOGO_EXTENSIONS) {
    const oldPath = path.join(uploadDir, `${companyId}${oldExt}`);
    if (oldPath !== targetPath) {
      await fs.rm(oldPath, { force: true });
    }
  }
  await fs.writeFile(targetPath, buffer);
  return fileName;
};
