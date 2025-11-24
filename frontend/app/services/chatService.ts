import { api } from "./api";
import type { ChatCreateRequest } from "~/types/api/chat/ChatCreateRequest";
import type { ChatMessageCreateRequest } from "~/types/api/chat/ChatMessageCreateRequest";
import type { ChatLastReadUpdateRequest } from "~/types/api/chat/ChatLastReadUpdateRequest";
import type {
  ChatMessageResponse,
  ChatResponse,
} from "~/types/api/chat/ChatResponse";
import type { PageResponse } from "~/types/api/common/PageResponse";

export const listMyChats = () => {
  return api.get<ChatResponse[]>("/chats");
};

export const createChat = (payload: ChatCreateRequest) => {
  return api.post<ChatResponse>("/chats", payload);
};

export const listChatMessages = (
  chatId: number,
  params?: { page?: number; size?: number }
) => {
  return api.get<PageResponse<ChatMessageResponse>>(
    `/chats/${chatId}/messages`,
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 50,
      },
    }
  );
};

export const sendChatMessage = (
  chatId: number,
  payload: ChatMessageCreateRequest
) => {
  return api.post<ChatMessageResponse>(`/chats/${chatId}/messages`, payload);
};

export const updateLastReadMessage = (
  chatId: number,
  payload: ChatLastReadUpdateRequest
) => {
  return api.patch<void>(`/chats/${chatId}/messages/read`, payload);
};
