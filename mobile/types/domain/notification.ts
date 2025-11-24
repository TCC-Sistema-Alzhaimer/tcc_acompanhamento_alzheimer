import { User } from "./user";

export interface Notification {
  id?: Number;
  recipientId: number;
  title: string;
  message: string;
  sender: User;
  read: boolean;

  examId?: number | null;
  associationId?: number | null;
  createdAt?: string;
}
