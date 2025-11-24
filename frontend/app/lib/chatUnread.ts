import type { ChatResponse } from "~/types/api/chat/ChatResponse";

function isChatUnreadByLastRead(chat: ChatResponse): boolean {
  const lastMessageId = chat.lastMessage?.id;
  if (!lastMessageId) {
    return false;
  }

  const lastReadMessageId = chat.lastReadMessageId ?? null;
  if (lastReadMessageId === null) {
    return true;
  }

  return lastReadMessageId < lastMessageId;
}

export function chatHasUnread(chat: ChatResponse): boolean {
  if (chat.hasUnreadMessages) {
    return true;
  }

  return isChatUnreadByLastRead(chat);
}

export function countUnreadChats(chats: ChatResponse[]): number {
  return chats.reduce((total, chat) => {
    return chatHasUnread(chat) ? total + 1 : total;
  }, 0);
}
