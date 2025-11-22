import clsx from "clsx";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDown, Loader2, RefreshCcw, Send } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  listChatMessages,
  sendChatMessage,
  updateLastReadMessage,
} from "~/services/chatService";
import type {
  ChatMessageResponse,
  ChatResponse,
} from "~/types/api/chat/ChatResponse";
import { emitChatUnreadRefreshEvent } from "~/lib/chatUnreadEvents";

const MESSAGE_REFRESH_INTERVAL_MS = 8_000;
const MESSAGE_MAX_LENGTH = 1_000;
const TIMEZONE_SUFFIX_REGEX = /(Z|[+-]\d{2}:?\d{2})$/;

type ChatPreviewPanelProps = {
  chat: ChatResponse;
  currentUserId: number | null;
};

type TimelineEntry =
  | { kind: "separator"; key: string; label: string }
  | {
      kind: "message";
      key: string;
      message: ChatMessageResponse;
      isMine: boolean;
      isSystem: boolean;
      showSender: boolean;
      timeLabel: string;
    };

export function ChatPreviewPanel({
  chat,
  currentUserId,
}: ChatPreviewPanelProps) {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isRefreshingMessages, setIsRefreshingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const lastAcknowledgedMessageIdRef = useRef<number | null>(
    chat.lastReadMessageId ?? null
  );
  const [messageDraft, setMessageDraft] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const participants = chat.participants
    .map((participant) =>
      participant.id === currentUserId ? "Você" : participant.name
    )
    .join(", ");
  const lastMessageDate = parseTimestamp(
    chat.lastMessage?.sentAt ?? chat.createdAt ?? null
  );
  const chatLabel = chat.name?.trim() || participants || `Chat #${chat.id}`;
  const chatInitials = chatLabel.slice(0, 2).toUpperCase();
  const participantDetails = useMemo(
    () =>
      chat.participants.map((participant) => ({
        id: participant.id,
        displayName:
          participant.id === currentUserId
            ? `${participant.name} (Você)`
            : participant.name,
        email: participant.email ?? "E-mail não informado",
      })),
    [chat.participants, currentUserId]
  );

  const loadMessages = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      setMessagesError(null);
      if (mode === "initial") {
        setIsLoadingMessages(true);
      } else {
        setIsRefreshingMessages(true);
      }

      try {
        const { data } = await listChatMessages(chat.id, { size: 50 });
        const content = Array.isArray(data?.content) ? data.content : [];
        setMessages(content);
      } catch (error) {
        console.error("Erro ao buscar mensagens", error);
        const backendMessage = (
          error as { response?: { data?: { message?: string } } }
        )?.response?.data?.message;
        setMessagesError(
          backendMessage ?? "Não foi possível carregar as mensagens deste chat."
        );
      } finally {
        if (mode === "initial") {
          setIsLoadingMessages(false);
        } else {
          setIsRefreshingMessages(false);
        }
      }
    },
    [chat.id]
  );

  useEffect(() => {
    setMessages([]);
    setMessagesError(null);
    setMessageDraft("");
    setSendError(null);
    setIsSendingMessage(false);
    loadMessages("initial");
  }, [chat.id, loadMessages]);

  useEffect(() => {
    lastAcknowledgedMessageIdRef.current = chat.lastReadMessageId ?? null;
  }, [chat.id, chat.lastReadMessageId]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadMessages("refresh");
    }, MESSAGE_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [chat.id, loadMessages]);

  useEffect(() => {
    const textarea = messageInputRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    const nextHeight = Math.max(textarea.scrollHeight, 48);
    textarea.style.height = `${nextHeight}px`;
  }, [messageDraft]);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    const lastEntry = messages[messages.length - 1];
    if (!lastEntry?.id) {
      return;
    }

    const alreadyAcknowledged =
      lastAcknowledgedMessageIdRef.current !== null &&
      lastAcknowledgedMessageIdRef.current >= lastEntry.id;

    if (alreadyAcknowledged) {
      return;
    }

    let isCancelled = false;

    const markAsRead = async () => {
      try {
        await updateLastReadMessage(chat.id, { messageId: lastEntry.id });
        if (!isCancelled) {
          lastAcknowledgedMessageIdRef.current = lastEntry.id;
          emitChatUnreadRefreshEvent();
        }
      } catch (error) {
        console.error("Erro ao atualizar mensagens lidas", error);
      }
    };

    markAsRead();

    return () => {
      isCancelled = true;
    };
  }, [chat.id, messages]);

  useEffect(() => {
    if (isLoadingMessages || !messages.length) {
      return;
    }

    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [chat.id, isLoadingMessages, messages]);

  const timelineEntries = useMemo<TimelineEntry[]>(() => {
    if (!messages.length) {
      return [];
    }

    const sorted = [...messages].sort((messageA, messageB) => {
      const dateA = parseTimestamp(messageA.sentAt)?.getTime() ?? 0;
      const dateB = parseTimestamp(messageB.sentAt)?.getTime() ?? 0;
      return dateA - dateB;
    });

    const entries: TimelineEntry[] = [];
    let lastDateKey: string | null = null;
    let previousSenderId: number | null = null;

    sorted.forEach((message) => {
      const sentAtDate = parseTimestamp(message.sentAt);
      const dateKey = sentAtDate
        ? format(sentAtDate, "yyyy-MM-dd")
        : `unknown-${message.id}`;

      if (dateKey !== lastDateKey) {
        entries.push({
          kind: "separator",
          key: `separator-${dateKey}-${message.id}`,
          label: formatTimelineDate(sentAtDate),
        });
        lastDateKey = dateKey;
        previousSenderId = null;
      }

      const senderId = message.sender?.id ?? null;
      const isMine = Boolean(
        senderId && currentUserId && senderId === currentUserId
      );
      const isSystem =
        message.type?.toUpperCase() === "SYSTEM" || !message.sender?.id;
      const shouldShowSender =
        !isMine &&
        !isSystem &&
        Boolean(message.sender?.name) &&
        (previousSenderId === null || senderId !== previousSenderId);

      entries.push({
        kind: "message",
        key: `message-${message.id}`,
        message,
        isMine,
        isSystem,
        showSender: shouldShowSender,
        timeLabel: sentAtDate
          ? format(sentAtDate, "HH:mm", { locale: ptBR })
          : "--:--",
      });

      previousSenderId = senderId;
    });

    return entries;
  }, [messages, currentUserId]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((previous) => !previous);
  }, []);

  const handleRefreshMessages = useCallback(() => {
    loadMessages("refresh");
  }, [loadMessages]);

  const handleDraftChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setMessageDraft(event.target.value);
      if (sendError) {
        setSendError(null);
      }
    },
    [sendError]
  );

  const handleSendMessage = useCallback(async () => {
    const trimmed = messageDraft.trim();
    if (!trimmed || trimmed.length > MESSAGE_MAX_LENGTH || isSendingMessage) {
      return;
    }

    setIsSendingMessage(true);
    setSendError(null);

    try {
      const { data } = await sendChatMessage(chat.id, { message: trimmed });
      setMessageDraft("");
      setMessages((previous) => {
        if (previous.some((entry) => entry.id === data.id)) {
          return previous;
        }
        return [...previous, data];
      });
      await loadMessages("refresh");
    } catch (error) {
      console.error("Erro ao enviar mensagem", error);
      const backendMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setSendError(backendMessage ?? "Não foi possível enviar a mensagem.");
    } finally {
      setIsSendingMessage(false);
    }
  }, [chat.id, messageDraft, isSendingMessage, loadMessages]);

  const handleComposerSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSendMessage();
    },
    [handleSendMessage]
  );

  const handleComposerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const remainingCharacters = Math.max(
    0,
    MESSAGE_MAX_LENGTH - messageDraft.length
  );
  const canSendMessage = messageDraft.trim().length > 0 && !isSendingMessage;

  const renderMessages = () => {
    if (isLoadingMessages) {
      return <MessageListSkeleton />;
    }

    if (messagesError) {
      return (
        <MessageAreaState
          tone="error"
          title="Não foi possível carregar as mensagens"
          description={messagesError}
          actionLabel="Tentar novamente"
          onAction={() => loadMessages("initial")}
        />
      );
    }

    if (!messages.length) {
      return (
        <p className="mt-auto text-center text-sm font-semibold text-gray-700">
          Nenhuma mensagem por aqui no momento.
        </p>
      );
    }

    return timelineEntries.map((entry) => {
      if (entry.kind === "separator") {
        return (
          <div key={entry.key} className="flex justify-center">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 shadow-sm">
              {entry.label}
            </span>
          </div>
        );
      }

      if (entry.isSystem) {
        return (
          <div key={entry.key} className="flex justify-center">
            <div className="max-w-[80%] rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
              <span className="font-semibold">{entry.message.message}</span>
              <span className="ml-2 font-medium text-gray-500">
                {entry.timeLabel}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div
          key={entry.key}
          className={clsx(
            "flex w-full",
            entry.isMine ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={clsx(
              "max-w-[78%] rounded-2xl px-4 py-2 text-sm shadow-sm",
              entry.isMine
                ? "rounded-br-md bg-emerald-600 text-white"
                : "rounded-bl-md border border-gray-200 bg-white text-gray-900"
            )}
          >
            {entry.showSender && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {entry.message.sender?.name ?? "Participante"}
              </p>
            )}
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
              {entry.message.message || "Mensagem indisponível."}
            </p>
            <p
              className={clsx(
                "mt-1 text-[11px] font-semibold text-right",
                entry.isMine ? "text-emerald-50" : "text-gray-600"
              )}
            >
              {entry.timeLabel}
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-2 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-semibold uppercase text-emerald-900">
            {chatInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-gray-900">
              {chatLabel}
            </p>
            <p className="truncate text-sm text-gray-600">
              {participants || "Participantes não informados"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleExpanded}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-emerald-500 hover:text-emerald-600"
            title={isExpanded ? "Recolher detalhes" : "Exibir detalhes"}
            aria-expanded={isExpanded}
          >
            <ChevronDown
              className={clsx(
                "size-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </button>

          <button
            type="button"
            onClick={handleRefreshMessages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-60"
            title="Atualizar mensagens"
            disabled={isRefreshingMessages}
          >
            {isRefreshingMessages ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCcw className="size-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
            Informações participantes
          </p>
          <div className="mt-3 space-y-2">
            {participantDetails.length ? (
              participantDetails.map((participant) => (
                <div
                  key={`${participant.id}-${participant.email}`}
                  className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium text-gray-900">
                    {participant.displayName}
                  </span>
                  <span className="text-xs text-gray-600">
                    {participant.email}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">
                Nenhum participante encontrado.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div
          ref={messagesContainerRef}
          className="flex flex-1 flex-col space-y-4 overflow-y-auto bg-gray-50 px-4 py-4"
        >
          {renderMessages()}
        </div>
      </div>

      <form
        onSubmit={handleComposerSubmit}
        className="space-y-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <textarea
            ref={messageInputRef}
            rows={2}
            value={messageDraft}
            onChange={handleDraftChange}
            onKeyDown={handleComposerKeyDown}
            placeholder="Escreva uma mensagem..."
            maxLength={MESSAGE_MAX_LENGTH}
            className="flex-1 resize-none overflow-hidden rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            style={{ minHeight: "48px" }}
          />
          <Button
            type="submit"
            variant="action"
            disabled={!canSendMessage}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap sm:w-auto"
          >
            {isSendingMessage ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Enviar
          </Button>
        </div>

        {sendError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {sendError}
          </div>
        )}

        <div className="flex flex-col gap-1 text-xs text-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold">
            {remainingCharacters} caractere(s) restantes.
          </span>
          <span className="text-gray-600">
            Enter envia · Shift + Enter insere uma nova linha.
          </span>
        </div>
      </form>
    </div>
  );
}

function MessageAreaState({
  title,
  description,
  actionLabel,
  onAction,
  tone = "default",
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-6 text-center",
        tone === "error"
          ? "border-red-200 bg-red-50/70 text-red-700"
          : "border-gray-200 bg-white text-gray-600"
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-current/80">{description}</p>
      {actionLabel && onAction && (
        <Button
          size="sm"
          variant={tone === "error" ? "destructive" : "outline"}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

function MessageListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`message-skeleton-${index}`}
          className={clsx(
            "flex w-full",
            index % 2 === 0 ? "justify-start" : "justify-end"
          )}
        >
          <div className="w-2/3 rounded-2xl bg-white/70 p-3 shadow-sm">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatTimelineDate(date: Date | null) {
  if (!date) {
    return "Data desconhecida";
  }

  if (isToday(date)) {
    return "Hoje";
  }

  if (isYesterday(date)) {
    return "Ontem";
  }

  return format(date, "dd 'de' MMMM", { locale: ptBR });
}

function parseTimestamp(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const normalized = TIMEZONE_SUFFIX_REGEX.test(trimmed)
    ? trimmed
    : `${trimmed}Z`;

  const parsedDate = new Date(normalized);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  const fallbackDate = new Date(trimmed);
  return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
}
