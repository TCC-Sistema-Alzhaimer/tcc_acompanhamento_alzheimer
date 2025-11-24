export interface ChatParticipant {
  id: number;
  name: string;
  email: string;
  type: string;
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
  hasUnreadMessages?: boolean;
  participants: ChatParticipant[];
}
