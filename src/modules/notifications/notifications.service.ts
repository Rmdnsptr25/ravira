import {
  NotificationStatus,
  NotificationType,
  Prisma,
  PrismaClient
} from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  bodySafe: string;
}

const notificationSelect = {
  id: true,
  userId: true,
  type: true,
  title: true,
  bodySafe: true,
  status: true,
  readAt: true,
  createdAt: true
} satisfies Prisma.NotificationSelect;

export const createNotification = async (
  input: CreateNotificationInput,
  client: PrismaExecutor = prisma
) => {
  return client.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      bodySafe: input.bodySafe,
      status: NotificationStatus.UNREAD
    },
    select: notificationSelect
  });
};

export const listMyNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    select: notificationSelect,
    orderBy: { createdAt: "desc" }
  });
};

export const markMyNotificationAsRead = async (
  userId: string,
  notificationId: string
) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId
    },
    select: { id: true }
  });

  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: {
      status: NotificationStatus.READ,
      readAt: new Date()
    },
    select: notificationSelect
  });
};
