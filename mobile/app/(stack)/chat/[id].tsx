import { Card } from "@/components/card/Card";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import {
  getChat,
  listMessages,
  listNewMessages,
  sendMessage,
  updateLastRead,
} from "@/services/chat-service";
import { ChatMessageResponse, ChatResponse } from "@/types/api/chat";
import { formatTimeOrDate } from "@/util/format";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MessageView = {
  id: string;
  text: string;
  time: string;
  variant: "in" | "out";
};

function mapMessages(
  messages: ChatMessageResponse[],
  currentUserId?: number
): MessageView[] {
  return messages.map((m) => ({
    id: String(m.id),
    text: m.message,
    time: formatTimeOrDate(m.sentAt),
    variant: currentUserId && m.sender?.id === currentUserId ? "out" : "in",
  }));
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const chatId = Array.isArray(id) ? id[0] : id;

  const { getSession } = useAuth();
  const userId = getSession?.user?.id ? Number(getSession.user.id) : undefined;

  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const scrollRef = useRef<ScrollView>(null);

  const [chat, setChat] = useState<ChatResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!getSession || !chatId) return;

    const loadChat = async () => {
      setLoading(true);
      try {
        const [chatResponse, messagePage] = await Promise.all([
          getChat(getSession.accessToken, chatId),
          listMessages(getSession.accessToken, chatId, { page: 0, size: 50 }),
        ]);
        setChat(chatResponse);
        setMessages(messagePage.content);
      } finally {
        setLoading(false);
        requestAnimationFrame(() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        );
      }
    };

    void loadChat();
  }, [getSession, chatId]);

  const lastMessageId = useMemo(
    () => (messages.length ? messages[messages.length - 1].id : null),
    [messages]
  );

  useEffect(() => {
    if (!getSession || !chatId || !lastMessageId) return;
    void updateLastRead(getSession.accessToken, chatId, {
      messageId: lastMessageId,
    }).catch(() => null);
  }, [getSession, chatId, lastMessageId]);

  useEffect(() => {
    if (!getSession || !chatId || !lastMessageId) return;
    const interval = setInterval(() => {
      void (async () => {
        try {
          const fresh = await listNewMessages(
            getSession.accessToken,
            chatId,
            lastMessageId
          );
          if (!fresh.length) return;
          setMessages((prev) => {
            const knownIds = new Set(prev.map((m) => m.id));
            const merged = [...prev];
            fresh.forEach((msg) => {
              if (!knownIds.has(msg.id)) {
                merged.push(msg);
              }
            });
            return merged;
          });
          requestAnimationFrame(() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          );
        } catch (error) {
          console.error("Falha ao buscar novas mensagens", error);
        }
      })();
    }, 4000);

    return () => clearInterval(interval);
  }, [getSession, chatId, lastMessageId]);

  const onSend = async () => {
    if (!getSession || !chatId) return;
    const trimmed = input.trim();
    if (!trimmed) return;

    setSending(true);
    try {
      const sent = await sendMessage(getSession.accessToken, chatId, {
        message: trimmed,
        type: "TEXT",
      });
      setMessages((prev) => [...prev, sent]);
      setInput("");
      requestAnimationFrame(() =>
        scrollRef.current?.scrollToEnd({ animated: true })
      );
    } finally {
      setSending(false);
    }
  };

  const displayMessages = useMemo(
    () => mapMessages(messages, userId),
    [messages, userId]
  );

  if (!getSession) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>
          Voce precisa estar autenticado para ver este chat.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios"
            ? insets.top + headerHeight
            : headerHeight + Math.max(insets.bottom, 12)
        }
      >
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" />
          </View>
        ) : chat ? (
          <>
            <View style={styles.header}>
              <Card.Root themed={true} style={styles.headerCard}>
                <Card.Avatar uri="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/07/Avatar-Fogo-e-Cinzas.png?w=1200&h=900&crop=0" />
                <Card.Title
                  title={chat.name || "Chat"}
                  subtitle={
                    chat.participants
                      .filter((p) => p.id !== userId)
                      .map((p) => p.name)
                      .join(", ") || "Participantes"
                  }
                />
              </Card.Root>
            </View>

            <ThemedView type="secondary" style={styles.content}>
              <ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={styles.messages}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                  requestAnimationFrame(() =>
                    scrollRef.current?.scrollToEnd({ animated: true })
                  )
                }
              >
                {displayMessages.map((m) => (
                  <MessageBubble key={m.id} {...m} />
                ))}
              </ScrollView>
            </ThemedView>

            <View
              style={[
                styles.footer,
                { paddingBottom: Math.max(insets.bottom, 12) },
              ]}
            >
              <Card.Root themed={false} style={styles.inputRow}>
                <ThemedTextInput
                  placeholder="Digite sua mensagem..."
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  returnKeyType="send"
                  onSubmitEditing={onSend}
                  editable={!sending}
                />
                <Card.Icon name="paperplane.fill" onPress={onSend} />
              </Card.Root>
            </View>
          </>
        ) : (
          <ThemedText type="title">Chat não encontrado.</ThemedText>
        )}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
  },
  header: {
    marginBottom: 12,
    justifyContent: "center",
  },
  headerCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 0,
  },
  content: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 12,
  },
  messages: {
    paddingVertical: 4,
    gap: 12,
  },
  footer: {
    paddingTop: 12,
  },
  keyboardAvoider: {
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderRadius: 12,
  },
  input: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingVertical: 10,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
