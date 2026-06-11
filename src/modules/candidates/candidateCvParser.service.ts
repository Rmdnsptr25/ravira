import { CvParsingStatus } from "@prisma/client";
import fs from "fs/promises";
import zlib from "zlib";

const MAX_PARSED_TEXT_LENGTH = 20000;

export interface ExtractedCvSkill {
  skillName: string;
  confidenceScore: number;
  source: "CV_PARSER";
}

export interface BasicCvParseResult {
  parsingStatus: CvParsingStatus;
  parsedText?: string;
  extractedSkills?: ExtractedCvSkill[];
  extractedEducation?: unknown;
  extractedExperience?: unknown;
}

const skillKeywords = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express",
  "Python",
  "SQL",
  "PostgreSQL",
  "Figma",
  "UI/UX",
  "Data Analysis",
  "Machine Learning"
] as const;

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const keywordPatterns: Record<(typeof skillKeywords)[number], RegExp> = {
  JavaScript: /\bJavaScript\b/i,
  TypeScript: /\bTypeScript\b/i,
  React: /\bReact\b/i,
  "Node.js": /\bNode\s*\.?\s*js\b/i,
  Express: /\bExpress\b/i,
  Python: /\bPython\b/i,
  SQL: /\bSQL\b/i,
  PostgreSQL: /\bPostgreSQL\b/i,
  Figma: /\bFigma\b/i,
  "UI/UX": /\bUI\s*\/\s*UX\b/i,
  "Data Analysis": /\bData\s+Analysis\b/i,
  "Machine Learning": /\bMachine\s+Learning\b/i
};

const normalizeText = (text: string) => {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const decodeXmlEntities = (value: string) => {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
};

const stripXmlTags = (xml: string) => {
  return decodeXmlEntities(xml.replace(/<[^>]+>/g, " "));
};

const unescapePdfLiteral = (value: string) => {
  return value
    .slice(1, -1)
    .replace(/\\([nrtbf])/g, " ")
    .replace(/\\([()\\])/g, "$1")
    .replace(/\\([0-7]{1,3})/g, (_match, octal: string) =>
      String.fromCharCode(Number.parseInt(octal, 8))
    );
};

const inflatePdfStream = (data: Buffer) => {
  try {
    return zlib.inflateSync(data).toString("utf8");
  } catch {
    return zlib.inflateRawSync(data).toString("utf8");
  }
};

const extractTextFromPdf = (buffer: Buffer) => {
  const raw = buffer.toString("latin1");
  const chunks: string[] = [];
  const streamPattern = /<<(?:[\s\S]*?)>>\s*stream\r?\n?([\s\S]*?)\r?\n?endstream/g;
  let streamMatch: RegExpExecArray | null;

  while ((streamMatch = streamPattern.exec(raw)) !== null) {
    const dictionaryEnd = streamMatch[0].indexOf("stream");
    const dictionary = streamMatch[0].slice(0, dictionaryEnd);
    const streamData = Buffer.from(streamMatch[1], "latin1");

    try {
      chunks.push(
        dictionary.includes("FlateDecode")
          ? inflatePdfStream(streamData)
          : streamData.toString("utf8")
      );
    } catch {
      // Ignore unreadable streams; the parser is best-effort for MVP.
    }
  }

  const literalStrings = raw.match(/\((?:\\.|[^\\)]){2,}\)/g) ?? [];
  chunks.push(...literalStrings.map(unescapePdfLiteral));

  for (const keyword of skillKeywords) {
    const escapedKeyword = escapeRegExp(keyword).replace(/\\\./g, "\\s*\\.?\\s*");
    if (new RegExp(escapedKeyword, "i").test(raw)) {
      chunks.push(keyword);
    }
  }

  return normalizeText(chunks.join(" "));
};

const findEndOfCentralDirectory = (buffer: Buffer) => {
  const minimumOffset = Math.max(0, buffer.length - 0xffff - 22);

  for (let offset = buffer.length - 22; offset >= minimumOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }

  return -1;
};

const readZipEntry = (buffer: Buffer, entryName: string) => {
  const eocdOffset = findEndOfCentralDirectory(buffer);

  if (eocdOffset < 0) {
    return null;
  }

  const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
  let offset = buffer.readUInt32LE(eocdOffset + 16);

  for (let index = 0; index < totalEntries && offset < buffer.length; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      return null;
    }

    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const fileNameStart = offset + 46;
    const fileNameEnd = fileNameStart + fileNameLength;
    const fileName = buffer.subarray(fileNameStart, fileNameEnd).toString("utf8");

    if (fileName === entryName) {
      const localFileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
      const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraLength;
      const data = buffer.subarray(dataStart, dataStart + compressedSize);

      if (compressionMethod === 0) {
        return data;
      }

      if (compressionMethod === 8) {
        return zlib.inflateRawSync(data);
      }

      return null;
    }

    offset = fileNameEnd + extraLength + commentLength;
  }

  return null;
};

const extractTextFromDocx = (buffer: Buffer) => {
  try {
    const documentXml = readZipEntry(buffer, "word/document.xml");

    if (!documentXml) {
      return "";
    }

    return normalizeText(stripXmlTags(documentXml.toString("utf8")));
  } catch {
    return "";
  }
};

export const extractSkillsFromText = (text: string): ExtractedCvSkill[] => {
  return skillKeywords
    .filter((keyword) => keywordPatterns[keyword].test(text))
    .map((keyword) => ({
      skillName: keyword,
      confidenceScore: 70,
      source: "CV_PARSER" as const
    }));
};

export const parseCvFile = async (
  filePath: string,
  fileType: string
): Promise<BasicCvParseResult> => {
  const buffer = await fs.readFile(filePath);
  const parsedText = fileType === "application/pdf"
    ? extractTextFromPdf(buffer)
    : extractTextFromDocx(buffer);
  const normalizedText = parsedText.slice(0, MAX_PARSED_TEXT_LENGTH);
  const hasUsefulText = /[A-Za-z]/.test(normalizedText) && normalizedText.length >= 10;
  const extractedSkills = hasUsefulText ? extractSkillsFromText(normalizedText) : [];

  if (!hasUsefulText) {
    return {
      parsingStatus: CvParsingStatus.NEED_REVIEW
    };
  }

  return {
    parsingStatus: CvParsingStatus.SUCCESS,
    parsedText: normalizedText,
    extractedSkills: extractedSkills.length > 0 ? extractedSkills : undefined
  };
};
