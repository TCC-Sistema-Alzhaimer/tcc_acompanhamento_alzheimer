import { NotificationResponse } from "@/types/api/notification";
import { Notification } from "@/types/domain/notification";

export function parseNotification(data: NotificationResponse): Notification {
  return {
    id: data.notificationId,
    recipientId: data.recipientid,
    title: data.title,
    message: data.message,
    sender: data.sender,
    read: data.read,
    examId: data.examId ?? null,
    associationId: data.associationId ?? null,
    createdAt: data.createdAt,
  };
}
