import { listMyChats } from "~/services/chatService";
import type { ChatResponse } from "~/types/api/chat/ChatResponse";
import { countUnreadChats } from "./chatUnread";
import { addChatUnreadRefreshListener } from "./chatUnreadEvents";

export type ChatUnreadState = {
  chats: ChatResponse[];
  count: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
};

const DEFAULT_POLL_INTERVAL_MS = 10_000;

let state: ChatUnreadState = {
  chats: [],
  count: 0,
  isLoading: true,
  error: null,
  lastUpdated: null,
};

const listeners = new Set<() => void>();
let subscribersCount = 0;
let pollIntervalMs = DEFAULT_POLL_INTERVAL_MS;
let pollHandle: number | null = null;
let refreshPromise: Promise<void> | null = null;
let unreadEventCleanup: (() => void) | null = null;

function emitChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error("Erro ao notificar mudanças de chats não lidos", error);
    }
  });
}

function setState(partial: Partial<ChatUnreadState>) {
  state = { ...state, ...partial };
  emitChange();
}

async function runRefresh(options?: { forceLoading?: boolean }) {
  if (refreshPromise) {
    return refreshPromise;
  }

  if (options?.forceLoading) {
    setState({ isLoading: true, error: null });
  }

  refreshPromise = (async () => {
    try {
      const response = await listMyChats();
      const raw = response.data;
      const chats = Array.isArray(raw)
        ? raw
        : Array.isArray(
              (raw as { content?: ChatResponse[] } | undefined)?.content
            )
          ? ((raw as { content?: ChatResponse[] }).content as ChatResponse[])
          : [];

      setState({
        chats,
        count: countUnreadChats(chats),
        error: null,
        isLoading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error("Erro ao buscar contagem de chats", error);
      setState({
        error: "Não foi possível atualizar as mensagens",
        isLoading: false,
      });
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function stopPolling() {
  if (pollHandle !== null && typeof window !== "undefined") {
    window.clearInterval(pollHandle);
    pollHandle = null;
  }
}

function startPolling() {
  if (typeof window === "undefined" || pollIntervalMs <= 0) {
    return;
  }

  stopPolling();
  pollHandle = window.setInterval(() => {
    void runRefresh();
  }, pollIntervalMs);
}

function attachUnreadEventBridge() {
  if (unreadEventCleanup || typeof window === "undefined") {
    return;
  }

  unreadEventCleanup = addChatUnreadRefreshListener(() => {
    void runRefresh();
  });
}

function detachUnreadEventBridge() {
  unreadEventCleanup?.();
  unreadEventCleanup = null;
}

export function subscribeToChatUnreadStore(listener: () => void) {
  listeners.add(listener);
  subscribersCount += 1;

  if (subscribersCount === 1) {
    attachUnreadEventBridge();
    startPolling();
    void runRefresh({ forceLoading: true });
  }

  return () => {
    listeners.delete(listener);
    subscribersCount = Math.max(0, subscribersCount - 1);

    if (subscribersCount === 0) {
      stopPolling();
      detachUnreadEventBridge();
    }
  };
}

export function getChatUnreadSnapshot() {
  return state;
}

export function refreshChatUnread(options?: { force?: boolean }) {
  return runRefresh({ forceLoading: options?.force ?? false });
}

export function setChatUnreadPollInterval(intervalMs: number) {
  const nextInterval = Number.isFinite(intervalMs)
    ? Math.max(0, Math.floor(intervalMs))
    : DEFAULT_POLL_INTERVAL_MS;

  if (pollIntervalMs === nextInterval) {
    return;
  }

  pollIntervalMs = nextInterval;

  if (subscribersCount > 0) {
    startPolling();
  }
}

export function getServerSnapshot() {
  return state;
}
