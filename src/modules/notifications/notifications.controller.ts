import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";
import * as notificationService from "./notifications.service";

export const listMyNotifications = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const notifications = await notificationService.listMyNotifications(req.user!.id);
    sendSuccess(res, "Notifications retrieved successfully.", notifications);
  }
);

export const markMyNotificationAsRead = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const notification = await notificationService.markMyNotificationAsRead(
      req.user!.id,
      req.params.notificationId as string
    );
    sendSuccess(res, "Notification marked as read successfully.", notification);
  }
);
