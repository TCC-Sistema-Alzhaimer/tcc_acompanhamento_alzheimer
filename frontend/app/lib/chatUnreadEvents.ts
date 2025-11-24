const CHAT_UNREAD_REFRESH_EVENT = "chat:unread-refresh";

export function emitChatUnreadRefreshEvent() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CHAT_UNREAD_REFRESH_EVENT));
}

export function addChatUnreadRefreshListener(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => {
    listener();
  };

  window.addEventListener(CHAT_UNREAD_REFRESH_EVENT, handler);

  return () => {
    window.removeEventListener(CHAT_UNREAD_REFRESH_EVENT, handler);
  };
}

export { CHAT_UNREAD_REFRESH_EVENT };
