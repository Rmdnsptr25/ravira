import {
  JobStatus,
  NotificationType,
  Prisma,
  PrismaClient,
  Role,
  TrainingStatus
} from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { createAuditLog } from "../audit-logs/auditLog.service";
import { createNotification } from "../notifications/notifications.service";
import { z } from "zod";
import {
  createSkillGapReportSchema,
  createTrainingProgressSchema,
  skillGapQuerySchema,
  updateTrainingProgressSchema
} from "./candidateDevelopment.validation";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;
type SkillGapInput = z.infer<typeof createSkillGapReportSchema>;
type SkillGapQuery = z.infer<typeof skillGapQuerySchema>;
type CreateTrainingProgressInput = z.infer<typeof createTrainingProgressSchema>;
type UpdateTrainingProgressInput = z.infer<typeof updateTrainingProgressSchema>;

interface OwnedSkill {
  skillName: string;
  level?: string | null;
  source?: string | null;
  confidenceScore?: number | null;
}

interface TargetSkill {
  skillName: string;
  required: boolean;
  weight: number;
}

interface PrioritySkill {
  skillName: string;
  required: boolean;
  weight: number;
  marketDemandCount: number;
  priorityScore: number;
  reason: string[];
}

interface SkillGapCalculation {
  candidateId: string;
  jobId?: string | null;
  targetRole?: string | null;
  ownedSkills: OwnedSkill[];
  matchedSkills: Array<TargetSkill & { matchedCandidateSkill: string }>;
  missingSkills: Array<TargetSkill & { marketDemandCount: number }>;
  prioritySkills: PrioritySkill[];
  summary: string;
  recommendationReason: string;
}

const skillGapReportSelect = {
  id: true,
  candidateId: true,
  jobId: true,
  targetRole: true,
  ownedSkills: true,
  missingSkills: true,
  matchedSkills: true,
  prioritySkills: true,
  summary: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.SkillGapReportSelect;

const courseSelect = {
  id: true,
  title: true,
  provider: true,
  skillTargets: true,
  duration: true,
  price: true,
  difficulty: true,
  language: true,
  url: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.CourseSelect;

const trainingProgressSelect = {
  id: true,
  candidateId: true,
  courseId: true,
  status: true,
  progressPct: true,
  completedAt: true,
  course: {
    select: courseSelect
  },
  createdAt: true,
  updatedAt: true
} satisfies Prisma.TrainingProgressSelect;

type CourseForRecommendation = Prisma.CourseGetPayload<{ select: typeof courseSelect }>;
type TrainingProgressWithCourse = Prisma.TrainingProgressGetPayload<{
  select: typeof trainingProgressSelect;
}>;

const targetRoleSkills: Record<string, string[]> = {
  "backend engineer": ["JavaScript", "TypeScript", "Node.js", "Express", "SQL", "PostgreSQL"],
  "frontend engineer": ["JavaScript", "TypeScript", "React", "UI/UX"],
  "full stack engineer": [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "SQL",
    "PostgreSQL"
  ],
  "data analyst": ["SQL", "PostgreSQL", "Python", "Data Analysis"],
  "machine learning engineer": ["Python", "SQL", "Data Analysis", "Machine Learning"],
  "ui ux designer": ["Figma", "UI/UX"]
};

const difficultyRank: Record<string, number> = {
  BEGINNER: 1,
  BASIC: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const canonicalSkill = (value: string) => {
  const compact = normalizeText(value).replace(/[^a-z0-9]/g, "");

  if (compact === "expressjs") return "express";
  if (compact === "node" || compact === "nodejs") return "nodejs";
  if (compact === "postgres" || compact === "postgresql") return "postgresql";
  if (compact === "uiux" || compact === "uxui") return "uiux";

  return compact;
};

const uniqueByCanonicalSkill = <T extends { skillName: string }>(items: T[]) => {
  const seen = new Set<string>();
  const uniqueItems: T[] = [];

  for (const item of items) {
    const key = canonicalSkill(item.skillName);

    if (!seen.has(key)) {
      seen.add(key);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
};

const getCandidateByUserId = async (userId: string, client: PrismaExecutor = prisma) => {
  const candidate = await client.candidate.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      skills: {
        select: {
          skillName: true,
          level: true,
          source: true,
          confidenceScore: true
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!candidate) {
    throw new AppError("Candidate profile not found.", 404);
  }

  return candidate;
};

const getPublishedJobTargetSkills = async (jobId: string) => {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      status: JobStatus.PUBLISHED
    },
    select: {
      id: true,
      title: true,
      skills: {
        select: {
          skillName: true,
          required: true,
          weight: true
        }
      }
    }
  });

  if (!job) {
    throw new AppError("Published job not found.", 404);
  }

  return {
    job,
    targetSkills: job.skills.map((skill) => ({
      skillName: skill.skillName,
      required: skill.required,
      weight: skill.weight
    }))
  };
};

const inferTargetRoleSkills = (targetRole?: string | null) => {
  const normalizedRole = normalizeText(targetRole ?? "backend engineer");
  const directMatch = targetRoleSkills[normalizedRole];

  if (directMatch) {
    return {
      targetRole: targetRole ?? "Backend Engineer",
      skills: directMatch
    };
  }

  const inferredEntry = Object.entries(targetRoleSkills).find(([role]) =>
    normalizedRole.includes(role.replace(" engineer", ""))
  );

  return {
    targetRole: targetRole ?? "Backend Engineer",
    skills: inferredEntry?.[1] ?? targetRoleSkills["backend engineer"]
  };
};

const getMarketDemandCounts = async () => {
  const groupedSkills = await prisma.jobSkill.groupBy({
    by: ["skillName"],
    where: {
      job: {
        status: JobStatus.PUBLISHED
      }
    },
    _count: {
      skillName: true
    }
  });

  const counts = new Map<string, number>();

  for (const groupedSkill of groupedSkills) {
    counts.set(canonicalSkill(groupedSkill.skillName), groupedSkill._count.skillName);
  }

  return counts;
};

const toJsonValue = (value: unknown): Prisma.InputJsonValue => {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
};

const parseSkillTargets = (value: Prisma.JsonValue): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatCourse = (course: CourseForRecommendation) => ({
  ...course,
  skillTargets: parseSkillTargets(course.skillTargets)
});

const formatTrainingProgress = (progress: TrainingProgressWithCourse) => ({
  ...progress,
  course: formatCourse(progress.course)
});

const buildSkillGapCalculation = async (
  userId: string,
  input: SkillGapInput | SkillGapQuery
): Promise<SkillGapCalculation> => {
  const candidate = await getCandidateByUserId(userId);
  const ownedSkills = uniqueByCanonicalSkill(
    candidate.skills.map((skill) => ({
      skillName: skill.skillName,
      level: skill.level,
      source: skill.source,
      confidenceScore: skill.confidenceScore
    }))
  );
  const ownedSkillMap = new Map(
    ownedSkills.map((skill) => [canonicalSkill(skill.skillName), skill.skillName])
  );
  const marketDemandCounts = await getMarketDemandCounts();

  let jobId: string | null = null;
  let targetRole: string | null = input.targetRole ?? null;
  let targetSkills: TargetSkill[] = [];

  if (input.jobId) {
    const jobTarget = await getPublishedJobTargetSkills(input.jobId);
    jobId = jobTarget.job.id;
    targetRole = input.targetRole ?? jobTarget.job.title;
    targetSkills = jobTarget.targetSkills;
  } else {
    const inferred = inferTargetRoleSkills(input.targetRole);
    targetRole = inferred.targetRole;
    targetSkills = inferred.skills.map((skillName) => ({
      skillName,
      required: true,
      weight: 1
    }));
  }

  const uniqueTargetSkills = uniqueByCanonicalSkill(targetSkills);
  const matchedSkills = uniqueTargetSkills
    .filter((skill) => ownedSkillMap.has(canonicalSkill(skill.skillName)))
    .map((skill) => ({
      ...skill,
      matchedCandidateSkill: ownedSkillMap.get(canonicalSkill(skill.skillName))!
    }));
  const missingSkills = uniqueTargetSkills
    .filter((skill) => !ownedSkillMap.has(canonicalSkill(skill.skillName)))
    .map((skill) => ({
      ...skill,
      marketDemandCount: marketDemandCounts.get(canonicalSkill(skill.skillName)) ?? 0
    }));
  const prioritySkills = missingSkills
    .map((skill) => {
      const marketDemandCount = marketDemandCounts.get(canonicalSkill(skill.skillName)) ?? 0;
      const priorityScore =
        (skill.required ? 100 : 50) + Math.max(skill.weight, 1) * 10 + marketDemandCount * 5;

      return {
        skillName: skill.skillName,
        required: skill.required,
        weight: skill.weight,
        marketDemandCount,
        priorityScore,
        reason: [
          skill.required
            ? "Skill ini termasuk requirement utama."
            : "Skill ini relevan tetapi bukan requirement utama.",
          `Bobot skill pada lowongan atau target role adalah ${skill.weight}.`,
          marketDemandCount > 0
            ? `Skill ini muncul pada ${marketDemandCount} lowongan published.`
            : "Skill ini belum banyak muncul pada lowongan published saat ini."
        ]
      };
    })
    .sort((left, right) => right.priorityScore - left.priorityScore);

  const summary =
    missingSkills.length === 0
      ? "Skill kandidat sudah cocok dengan kebutuhan utama target."
      : `Ditemukan ${matchedSkills.length} skill cocok dan ${missingSkills.length} skill gap untuk target ${targetRole}.`;
  const recommendationReason =
    prioritySkills.length === 0
      ? "Tidak ada skill prioritas yang perlu ditambahkan saat ini."
      : "Skill prioritas dihitung dari requirement, bobot skill, dan frekuensi skill pada lowongan published.";

  return {
    candidateId: candidate.id,
    jobId,
    targetRole,
    ownedSkills,
    matchedSkills,
    missingSkills,
    prioritySkills,
    summary,
    recommendationReason
  };
};

export const generateMySkillGapReport = async (
  userId: string,
  actorRole: Role,
  input: SkillGapInput | SkillGapQuery
) => {
  const calculation = await buildSkillGapCalculation(userId, input);

  return prisma.$transaction(async (tx) => {
    const report = await tx.skillGapReport.create({
      data: {
        candidateId: calculation.candidateId,
        jobId: calculation.jobId ?? undefined,
        targetRole: calculation.targetRole ?? undefined,
        ownedSkills: toJsonValue(calculation.ownedSkills),
        missingSkills: toJsonValue(calculation.missingSkills),
        matchedSkills: toJsonValue(calculation.matchedSkills),
        prioritySkills: toJsonValue(calculation.prioritySkills),
        summary: calculation.summary
      },
      select: skillGapReportSelect
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "SKILL_GAP_GENERATED",
        entityType: "SkillGapReport",
        entityId: report.id,
        afterValue: {
          id: report.id,
          candidateId: report.candidateId,
          jobId: report.jobId,
          targetRole: report.targetRole,
          matchedSkillsCount: calculation.matchedSkills.length,
          missingSkillsCount: calculation.missingSkills.length,
          prioritySkillsCount: calculation.prioritySkills.length
        },
        reason: "Rule-based MVP skill gap report generated."
      },
      tx
    );

    await createNotification(
      {
        userId,
        type: NotificationType.SYSTEM,
        title: "Skill gap berhasil dibuat",
        bodySafe:
          "Skill gap Anda berhasil dibuat. Silakan tinjau skill prioritas dan rekomendasi training."
      },
      tx
    );

    return {
      ...report,
      recommendationReason: calculation.recommendationReason
    };
  });
};

export const getMyTrainingRecommendations = async (
  userId: string,
  input: SkillGapQuery
) => {
  const calculation = await buildSkillGapCalculation(userId, input);
  const courses = await prisma.course.findMany({
    select: courseSelect,
    orderBy: { createdAt: "asc" }
  });
  const formattedCourses = courses.map(formatCourse);
  const recommendations = calculation.prioritySkills.map((prioritySkill) => {
    const priorityCanonical = canonicalSkill(prioritySkill.skillName);
    const recommendedCourses = formattedCourses
      .map((course) => {
        const matchedSkillTargets = course.skillTargets.filter(
          (skillTarget) => canonicalSkill(skillTarget) === priorityCanonical
        );
        const gapCoverage = course.skillTargets.filter((skillTarget) =>
          calculation.missingSkills.some(
            (missingSkill) => canonicalSkill(missingSkill.skillName) === canonicalSkill(skillTarget)
          )
        ).length;

        return {
          course,
          matchedSkillTargets,
          score: matchedSkillTargets.length * 10 + gapCoverage
        };
      })
      .filter((item) => item.matchedSkillTargets.length > 0)
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return (
          (difficultyRank[left.course.difficulty.toUpperCase()] ?? 99) -
          (difficultyRank[right.course.difficulty.toUpperCase()] ?? 99)
        );
      })
      .slice(0, 3)
      .map((item) => item.course);

    return {
      prioritySkill: prioritySkill.skillName,
      recommendedCourses,
      reason:
        recommendedCourses.length > 0
          ? "Course direkomendasikan karena skill target cocok dengan skill gap prioritas."
          : "Belum ada course yang cocok untuk skill prioritas ini pada katalog MVP."
    };
  });

  return {
    jobId: calculation.jobId,
    targetRole: calculation.targetRole,
    summary: calculation.summary,
    emptyStateMessage:
      recommendations.length === 0
        ? "Belum ada skill gap prioritas untuk direkomendasikan training."
        : undefined,
    recommendations
  };
};

export const listMyTrainingProgress = async (userId: string) => {
  const candidate = await getCandidateByUserId(userId);
  const progress = await prisma.trainingProgress.findMany({
    where: { candidateId: candidate.id },
    select: trainingProgressSelect,
    orderBy: { createdAt: "desc" }
  });

  return progress.map(formatTrainingProgress);
};

const completeTraining = async (
  userId: string,
  actorRole: Role,
  progress: TrainingProgressWithCourse,
  client: PrismaExecutor
) => {
  const skillTargets = parseSkillTargets(progress.course.skillTargets);

  if (skillTargets.length > 0) {
    await client.candidateSkill.createMany({
      data: skillTargets.map((skillName) => ({
        candidateId: progress.candidateId,
        skillName,
        source: "TRAINING",
        confidenceScore: 85
      })),
      skipDuplicates: true
    });
  }

  await createAuditLog(
    {
      actorUserId: userId,
      actorRole,
      action: "TRAINING_COMPLETED",
      entityType: "TrainingProgress",
      entityId: progress.id,
      afterValue: {
        id: progress.id,
        candidateId: progress.candidateId,
        courseId: progress.courseId,
        status: progress.status,
        progressPct: progress.progressPct,
        skillTargetsCount: skillTargets.length
      },
      reason: "Candidate completed training."
    },
    client
  );

  await createNotification(
    {
      userId,
      type: NotificationType.SYSTEM,
      title: "Training selesai",
      bodySafe: "Skill Anda telah diperbarui berdasarkan training yang diselesaikan."
    },
    client
  );
};

export const createMyTrainingProgress = async (
  userId: string,
  actorRole: Role,
  input: CreateTrainingProgressInput
) => {
  const candidate = await getCandidateByUserId(userId);

  return prisma.$transaction(async (tx) => {
    const course = await tx.course.findUnique({
      where: { id: input.courseId },
      select: { id: true }
    });

    if (!course) {
      throw new AppError("Course not found.", 404);
    }

    const existingProgress = await tx.trainingProgress.findUnique({
      where: {
        candidateId_courseId: {
          candidateId: candidate.id,
          courseId: input.courseId
        }
      },
      select: { id: true }
    });

    if (existingProgress) {
      throw new AppError("Training progress for this course already exists.", 409);
    }

    const status = input.status ?? TrainingStatus.IN_PROGRESS;
    const progressPct =
      status === TrainingStatus.COMPLETED ? 100 : input.progressPct ?? 0;
    const progress = await tx.trainingProgress.create({
      data: {
        candidateId: candidate.id,
        courseId: input.courseId,
        status,
        progressPct,
        completedAt: status === TrainingStatus.COMPLETED ? new Date() : undefined
      },
      select: trainingProgressSelect
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "TRAINING_STARTED",
        entityType: "TrainingProgress",
        entityId: progress.id,
        afterValue: {
          id: progress.id,
          candidateId: progress.candidateId,
          courseId: progress.courseId,
          status: progress.status,
          progressPct: progress.progressPct
        },
        reason: "Candidate started training."
      },
      tx
    );

    if (status === TrainingStatus.COMPLETED) {
      await completeTraining(userId, actorRole, progress, tx);
    }

    return formatTrainingProgress(progress);
  });
};

export const updateMyTrainingProgress = async (
  userId: string,
  actorRole: Role,
  progressId: string,
  input: UpdateTrainingProgressInput
) => {
  const candidate = await getCandidateByUserId(userId);

  return prisma.$transaction(async (tx) => {
    const before = await tx.trainingProgress.findFirst({
      where: {
        id: progressId,
        candidateId: candidate.id
      },
      select: trainingProgressSelect
    });

    if (!before) {
      throw new AppError("Training progress not found.", 404);
    }

    const nextStatus = input.status ?? before.status;
    const progressPct =
      nextStatus === TrainingStatus.COMPLETED ? 100 : input.progressPct ?? before.progressPct;
    const after = await tx.trainingProgress.update({
      where: { id: progressId },
      data: {
        status: nextStatus,
        progressPct,
        completedAt:
          nextStatus === TrainingStatus.COMPLETED
            ? before.completedAt ?? new Date()
            : null
      },
      select: trainingProgressSelect
    });

    await createAuditLog(
      {
        actorUserId: userId,
        actorRole,
        action: "TRAINING_PROGRESS_UPDATED",
        entityType: "TrainingProgress",
        entityId: after.id,
        beforeValue: {
          id: before.id,
          candidateId: before.candidateId,
          courseId: before.courseId,
          status: before.status,
          progressPct: before.progressPct
        },
        afterValue: {
          id: after.id,
          candidateId: after.candidateId,
          courseId: after.courseId,
          status: after.status,
          progressPct: after.progressPct
        },
        reason: "Candidate updated training progress."
      },
      tx
    );

    if (before.status !== TrainingStatus.COMPLETED && after.status === TrainingStatus.COMPLETED) {
      await completeTraining(userId, actorRole, after, tx);
    }

    return formatTrainingProgress(after);
  });
};
