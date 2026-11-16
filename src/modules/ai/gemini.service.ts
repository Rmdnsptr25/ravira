import { z } from "zod";
import { env } from "../../config/env";

const DEFAULT_TIMEOUT_MS = 10000;

interface GeminiCandidatePart {
  text?: string;
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiCandidatePart[];
    };
  }>;
}

export const isGeminiConfigured = (): boolean => {
  return (env.GEMINI_API_KEY ?? "").trim().length > 0;
};

const stripMarkdownJsonFence = (rawText: string): string => {
  const trimmed = rawText.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmed;
};

type GeminiHttpPost = (
  url: string,
  headers: Record<string, string>,
  body: string,
  timeoutMs: number
) => Promise<{ statusCode: number; body: string }>;

const postJsonOverHttps: GeminiHttpPost = async (
  url,
  headers,
  body,
  timeoutMs
) => {
  const https = await import("https");
  return new Promise((resolve, reject) => {
    const req = https.default.request(
      url,
      {
        method: "POST",
        family: 4,
        headers: {
          ...headers,
          "Content-Length": String(Buffer.byteLength(body))
        }
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer | string) => {
          chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            body: Buffer.concat(chunks).toString("utf8")
          });
        });
      }
    );

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("Gemini API request timed out"));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

let customHttpPost: GeminiHttpPost | null = null;

export const setGeminiHttpPostForTests = (transport: GeminiHttpPost | null) => {
  customHttpPost = transport;
};

/**
 * Calls Google Gemini generateContent REST API and validates the JSON payload with Zod.
 * Returns null if Gemini is unconfigured, times out, fails, or returns invalid JSON.
 */
export const generateGeminiJson = async <TSchema extends z.ZodTypeAny>(options: {
  prompt: string;
  schema: TSchema;
  timeoutMs?: number;
}): Promise<z.infer<TSchema> | null> => {
  const apiKey = (env.GEMINI_API_KEY ?? "").trim();
  if (!apiKey) {
    return null;
  }

  const model = (env.GEMINI_MODEL ?? "gemini-3.8-flash").trim() || "gemini-3.8-flash";

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const requestBody = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: options.prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    const transport = customHttpPost ?? postJsonOverHttps;
    const response = await transport(
      endpoint,
      {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      requestBody,
      options.timeoutMs ?? DEFAULT_TIMEOUT_MS
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      return null;
    }

    const payload = JSON.parse(response.body) as GeminiGenerateContentResponse;
    const rawText = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return null;
    }

    const parsedJson: unknown = JSON.parse(stripMarkdownJsonFence(rawText));
    const validated = options.schema.safeParse(parsedJson);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
};
