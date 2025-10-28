import { RecipientStatus, User } from "./user";

export interface Notification {
  id?: Number;
  title: string;
  message: string;
  sender: User;
  recipients: RecipientStatus[];

  examId?: number | null;
  associationId?: number | null;

  createdAt?: string;
}
