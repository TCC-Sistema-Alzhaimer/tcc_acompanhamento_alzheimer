import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  getChatUnreadSnapshot,
  getServerSnapshot,
  refreshChatUnread,
  setChatUnreadPollInterval,
  subscribeToChatUnreadStore,
} from "~/lib/chatUnreadStore";

const DEFAULT_POLL_INTERVAL_MS = 10_000;

interface UseChatUnreadCountOptions {
  pollIntervalMs?: number;
}

export function useChatUnreadCount(options?: UseChatUnreadCountOptions) {
  const { pollIntervalMs = DEFAULT_POLL_INTERVAL_MS } = options ?? {};

  const snapshot = useSyncExternalStore(
    subscribeToChatUnreadStore,
    getChatUnreadSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    setChatUnreadPollInterval(pollIntervalMs);
  }, [pollIntervalMs]);

  const refresh = useCallback(() => {
    return refreshChatUnread({ force: true });
  }, []);

  return {
    unreadChats: snapshot.count,
    chats: snapshot.chats,
    isLoading: snapshot.isLoading,
    error: snapshot.error,
    lastUpdated: snapshot.lastUpdated,
    refresh,
  };
}
