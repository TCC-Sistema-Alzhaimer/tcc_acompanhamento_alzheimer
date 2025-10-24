import { NotificationType } from "./NotificationType";

export interface NotificationRecipientResponse {
  notificationId: number;
  recipientId: number;
  title: string;
  message: string;
  createdAt: string;
  type?: NotificationType;
  examId?: number | null;
  associationId?: number | null;
  read: boolean;
  readAt?: string | null;
  sender: {
    id: number;
    name: string;
    email: string;
  };
}
