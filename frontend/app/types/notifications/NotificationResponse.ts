import { NotificationType } from "./NotificationType";

export interface NotificationRecipientResponse {
  notificationId: number;
  recipientId: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  readAt?: string | null;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  type?: NotificationType;
  associationId?: number | null;
}
