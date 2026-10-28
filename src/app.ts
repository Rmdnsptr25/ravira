import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import adminRoutes from "./modules/admin/admin.routes";
import applicationRoutes from "./modules/applications/applications.routes";
import appealRoutes from "./modules/appeals/appeals.routes";
import authRoutes from "./modules/auth/auth.routes";
import candidateRoutes from "./modules/candidates/candidates.routes";
import jobRoutes from "./modules/jobs/jobs.routes";
import notificationRoutes from "./modules/notifications/notifications.routes";
import recruiterRoutes from "./modules/recruiters/recruiterJobs.routes";
import { sendSuccess } from "./utils/response";

const app = express();

const allowedOrigins =
  env.CORS_ORIGIN === "*"
    ? "*"
    : env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (_req, res) => {
  sendSuccess(res, "Ravira backend is running.", {
    service: "ravira-backend",
    health: "/health",
    apiBase: "/api/v1"
  });
});

app.get("/health", (_req, res) => {
  sendSuccess(res, "Ravira backend is running.", {
    service: "ravira-backend",
    environment: env.NODE_ENV
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/appeals", appealRoutes);
app.use("/api/v1/candidates", candidateRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/recruiter", recruiterRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
