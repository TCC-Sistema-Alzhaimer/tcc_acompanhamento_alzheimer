import clsx from "clsx";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, MessageCirclePlus, RefreshCcw } from "lucide-react";
import { useMemo } from "react";

import { UserSearch } from "~/components/UserList/UserSearch";
import { Button } from "~/components/ui/button";
import { chatHasUnread, countUnreadChats } from "~/lib/chatUnread";
import type { ChatResponse } from "~/types/api/chat/ChatResponse";

const EMPTY_MESSAGE = "Nenhuma mensagem enviada ainda";

export type ChatListPanelProps = {
  chats: ChatResponse[];
  isLoading: boolean;
  error: string | null;
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onRefresh: () => void;
  onOpenCreateChat: () => void;
  onSearch: (term: string) => void;
};

export function ChatListPanel({
  chats,
  isLoading,
  error,
  selectedChatId,
  onSelectChat,
  onRefresh,
  onOpenCreateChat,
  onSearch,
}: ChatListPanelProps) {
  const unreadChatsCount = useMemo(() => countUnreadChats(chats), [chats]);

  const renderListContent = () => {
    if (isLoading) {
      return <ChatListSkeleton />;
    }

    if (error) {
      return (
        <ChatListState
          tone="error"
          title="Algo deu errado"
          description={error}
          actionLabel="Tentar novamente"
          onAction={onRefresh}
        />
      );
    }

    if (!chats.length) {
      return (
        <ChatListState
          title="Nenhuma conversa encontrada"
          description="Tente ajustar a busca ou atualize a lista."
          actionLabel="Atualizar"
          onAction={onRefresh}
        />
      );
    }

    return chats.map((chat) => (
      <ChatListItem
        chat={chat}
        key={chat.id}
        selected={chat.id === selectedChatId}
        onSelect={onSelectChat}
      />
    ));
  };

  return (
    <aside className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <UserSearch onSearch={onSearch} placeholder="Buscar conversas..." />
          </div>

          <Button
            type="button"
            size="lg"
            variant="action"
            className="flex items-center justify-center gap-2 rounded-lg px-6 min-h-[52px]"
            onClick={onOpenCreateChat}
            title="Criar um novo chat"
          >
            Chat
            <MessageCirclePlus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div
          className={clsx(
            "flex flex-col",
            chats.length > 0 ? "gap-2" : "gap-0"
          )}
        >
          {renderListContent()}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-700">
        <span>
          {isLoading
            ? "Carregando conversas..."
            : error
              ? "Erro ao carregar conversas"
              : unreadChatsCount === 0
                ? "Todas as conversas foram lidas"
                : `${unreadChatsCount} conversa(s) não lida(s)`}
        </span>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-50"
          title="Atualizar lista de chats"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCcw className="size-4" />
          )}
        </button>
      </div>
    </aside>
  );
}

function ChatListItem({
  chat,
  selected,
  onSelect,
}: {
  chat: ChatResponse;
  selected: boolean;
  onSelect: (chatId: number) => void;
}) {
  const lastMessageDate = parseTimestamp(
    chat.lastMessage?.sentAt ?? chat.createdAt ?? null
  );
  const relativeTime = lastMessageDate
    ? formatDistanceToNow(lastMessageDate, {
        addSuffix: true,
        locale: ptBR,
      })
    : null;
  const timestampLabel = lastMessageDate
    ? formatChatListLabel(lastMessageDate)
    : null;

  const preview = chat.lastMessage?.message?.trim() || EMPTY_MESSAGE;
  const participants = chat.participants
    .map((participant) => participant.name)
    .join(", ");
  const chatLabel = chat.name?.trim() || participants || `Chat #${chat.id}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(chat.id)}
      className="w-full text-left"
    >
      <div
        className={clsx(
          "flex flex-col gap-2 rounded-lg border px-3.5 py-2.5 transition",
          selected
            ? "border-emerald-600 bg-emerald-50"
            : "border-transparent bg-gray-50 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold uppercase text-emerald-900">
            {chatLabel.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate text-sm font-semibold text-gray-900">
                {chatLabel}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                {chatHasUnread(chat) && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800">
                    Novo
                  </span>
                )}
                {timestampLabel && (
                  <span title={relativeTime ?? undefined}>
                    {timestampLabel}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{preview}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

function ChatListState({
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
          ? "border-red-200 bg-red-50/40 text-red-600"
          : "border-gray-200 bg-gray-50 text-gray-600"
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-current/80">{description}</p>
      {actionLabel && onAction && (
        <Button
          size="sm"
          variant={tone === "error" ? "destructive" : "outline"}
          onClick={onAction}
          className="mt-1"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

function ChatListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`chat-skeleton-${index}`}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function formatChatListLabel(date: Date) {
  if (isToday(date)) {
    return format(date, "HH:mm", { locale: ptBR });
  }

  if (isYesterday(date)) {
    return "Ontem";
  }

  return format(date, "dd/MM", { locale: ptBR });
}

const TIMEZONE_SUFFIX_REGEX = /(Z|[+-]\d{2}:?\d{2})$/;

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
