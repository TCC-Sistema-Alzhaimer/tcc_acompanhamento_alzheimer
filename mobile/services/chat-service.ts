import {
  ChatCreateRequest,
  ChatLastReadUpdateRequest,
  ChatMessageCreateRequest,
  ChatMessageResponse,
  ChatResponse,
  ChatUserSearchResult,
  PageResponse,
} from "@/types/api/chat";
import { api } from "./api";
import { ROUTES } from "./routes";

export async function listMyChats(
  accessToken: string
): Promise<ChatResponse[]> {
  try {
    const res = await api.get<ChatResponse[]>(ROUTES.CHATS, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
}

export async function getChat(
  accessToken: string,
  chatId: string
): Promise<ChatResponse> {
  const res = await api.get<ChatResponse>(ROUTES.CHAT_BY_ID(chatId), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}

export async function createChat(
  accessToken: string,
  payload: ChatCreateRequest
): Promise<ChatResponse> {
  const res = await api.post<ChatResponse>(ROUTES.CHATS, payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}

export async function searchUsersForChat(
  accessToken: string,
  query: string
): Promise<ChatUserSearchResult[]> {
  const res = await api.get<ChatUserSearchResult[]>(ROUTES.CHAT_SEARCH_USERS, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { query },
  });
  return res.data;
}

export async function listMessages(
  accessToken: string,
  chatId: string,
  { page = 0, size = 50 } = {}
): Promise<PageResponse<ChatMessageResponse>> {
  const res = await api.get<PageResponse<ChatMessageResponse>>(
    ROUTES.CHAT_MESSAGES(chatId),
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { page, size },
    }
  );
  return res.data;
}

export async function listNewMessages(
  accessToken: string,
  chatId: string,
  afterMessageId: number
): Promise<ChatMessageResponse[]> {
  const res = await api.get<ChatMessageResponse[]>(
    ROUTES.CHAT_NEW_MESSAGES(chatId),
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { afterMessageId },
    }
  );
  return res.data;
}

export async function sendMessage(
  accessToken: string,
  chatId: string,
  payload: ChatMessageCreateRequest
): Promise<ChatMessageResponse> {
  const res = await api.post<ChatMessageResponse>(
    ROUTES.CHAT_MESSAGES(chatId),
    payload,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res.data;
}

export async function updateLastRead(
  accessToken: string,
  chatId: string,
  payload: ChatLastReadUpdateRequest
): Promise<void> {
  await api.patch<void>(ROUTES.CHAT_READ(chatId), payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
