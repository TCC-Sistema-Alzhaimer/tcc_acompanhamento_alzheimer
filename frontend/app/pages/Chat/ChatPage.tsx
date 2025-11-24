import { useCallback, useEffect, useMemo, useState } from "react";

import GenericModal from "~/components/modals/GenericModal";
import { useAuth } from "~/hooks/useAuth";
import { listMyChats } from "~/services/chatService";
import type { ChatResponse } from "~/types/api/chat/ChatResponse";

import { ChatListPanel } from "./components/ChatListPanel";
import { ChatPreviewPanel } from "./components/ChatPreviewPanel";
import { CreateChatForm } from "./components/CreateChatForm";
import type { AuthUserLike } from "./chatUtils";
import { getNumericId, normalizeCurrentUser } from "./chatUtils";

const CHAT_LIST_REFRESH_INTERVAL_MS = 15_000;

export default function ChatPage() {
  const { user } = useAuth();
  const normalizedCurrentUser = useMemo(
    () => normalizeCurrentUser(user),
    [user]
  );
  const currentUserId = useMemo(
    () =>
      getNumericId((user as AuthUserLike | null)?.userId) ??
      getNumericId(user?.id) ??
      null,
    [user]
  );
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const fetchChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await listMyChats();
      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar chats", err);
      setError(
        "Não conseguimos carregar suas conversas agora. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      fetchChats();
    }, CHAT_LIST_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [fetchChats]);

  const handleChatCreated = useCallback(
    async (chat: ChatResponse) => {
      await fetchChats();
      setSelectedChatId(chat.id);
      setIsCreateModalOpen(false);
    },
    [fetchChats, setSelectedChatId, setIsCreateModalOpen]
  );

  const sortedChats = useMemo(() => {
    return [...chats].sort((chatA, chatB) => {
      const timeA = getSortableTimestamp(chatA);
      const timeB = getSortableTimestamp(chatB);
      return timeB - timeA;
    });
  }, [chats]);

  useEffect(() => {
    if (!sortedChats.length) {
      setSelectedChatId(null);
      return;
    }

    if (
      selectedChatId &&
      sortedChats.some((chat) => chat.id === selectedChatId)
    ) {
      return;
    }

    setSelectedChatId(sortedChats[0]?.id ?? null);
  }, [sortedChats, selectedChatId]);

  const filteredChats = useMemo(() => {
    if (!searchTerm.trim()) {
      return sortedChats;
    }

    const term = searchTerm.toLowerCase();
    return sortedChats.filter((chat) => {
      const name = chat.name?.toLowerCase() ?? "";
      const participants = chat.participants
        .map((participant) => participant.name?.toLowerCase() ?? "")
        .join(" ");
      const lastMessage = chat.lastMessage?.message?.toLowerCase() ?? "";
      return (
        name.includes(term) ||
        participants.includes(term) ||
        lastMessage.includes(term)
      );
    });
  }, [sortedChats, searchTerm]);

  const activeChat =
    filteredChats.find((chat) => chat.id === selectedChatId) ??
    sortedChats.find((chat) => chat.id === selectedChatId) ??
    null;

  return (
    <>
      <section className="grid h-full gap-6 lg:grid-cols-[360px_1fr]">
        <ChatListPanel
          chats={filteredChats}
          isLoading={isLoading}
          error={error}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          onRefresh={fetchChats}
          onOpenCreateChat={() => setIsCreateModalOpen(true)}
          onSearch={handleSearch}
        />

        <section className="flex min-h-[420px] flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          {activeChat ? (
            <ChatPreviewPanel chat={activeChat} currentUserId={currentUserId} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
              <p className="text-base font-semibold text-gray-700">
                Selecione um chat
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Em breve esta área exibirá o histórico completo de mensagens.
              </p>
            </div>
          )}
        </section>
      </section>

      <GenericModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Iniciar novo chat"
      >
        {normalizedCurrentUser && (
          <CreateChatForm
            isOpen={isCreateModalOpen}
            onCancel={() => setIsCreateModalOpen(false)}
            onCreated={handleChatCreated}
            currentUser={normalizedCurrentUser}
          />
        )}
      </GenericModal>
    </>
  );
}

function getSortableTimestamp(chat: ChatResponse) {
  const reference = parseTimestamp(
    chat.lastMessage?.sentAt ?? chat.createdAt ?? null
  );
  return reference ? reference.getTime() : 0;
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
