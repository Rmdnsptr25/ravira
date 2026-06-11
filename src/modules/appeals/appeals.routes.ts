import { Role } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import { validateBody } from "../../middlewares/validateRequest";
import { createMyAppeal } from "./appeals.controller";
import { createAppealSchema } from "./appeals.validation";

const router = Router();

router.use(authMiddleware, roleMiddleware(Role.CANDIDATE));

router.post("/", validateBody(createAppealSchema), createMyAppeal);

export default router;
