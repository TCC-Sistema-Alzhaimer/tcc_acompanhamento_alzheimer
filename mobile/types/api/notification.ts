import { User } from "../domain/user";

export interface NotificationResponse {
  notificationId: number;
  recipientid: number;
  title: string;
  message: string;
  createdAt: string;
  type: string;
  associationId?: number;
  examId?: number;
  read: boolean;
  readAt?: string;
  sender: User;
}
