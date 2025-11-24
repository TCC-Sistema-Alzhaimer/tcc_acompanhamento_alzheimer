import { Roles } from "../enum/roles";

export interface ChatParticipant {
  id: number;
  name: string;
  email: string;
  type: Roles;
}

export interface ChatMessageResponse {
  id: number;
  message: string;
  type: string;
  sentAt: string;
  sender: ChatParticipant;
}

export interface ChatResponse {
  id: number;
  name?: string;
  createdAt?: string;
  lastMessage?: ChatMessageResponse | null;
  lastReadMessageId?: number | null;
  hasUnreadMessages: boolean;
  participants: ChatParticipant[];
}

export interface ChatMessageCreateRequest {
  message: string;
  type?: string;
}

export interface ChatLastReadUpdateRequest {
  messageId: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
