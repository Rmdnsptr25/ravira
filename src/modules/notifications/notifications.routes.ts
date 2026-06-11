import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { validateParams } from "../../middlewares/validateRequest";
import {
  listMyNotifications,
  markMyNotificationAsRead
} from "./notifications.controller";
import { notificationIdParamSchema } from "./notifications.validation";

const router = Router();

router.use(authMiddleware);

router.get("/", listMyNotifications);
router.patch(
  "/:notificationId/read",
  validateParams(notificationIdParamSchema),
  markMyNotificationAsRead
);

export default router;
