import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { listMyChats } from "@/services/chat-service";
import { ChatResponse } from "@/types/api/chat";
import { formatTimeOrDate } from "@/util/format";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function MessagesScreen() {
  const router = useRouter();
  const { getSession } = useAuth();
  const brand = useThemeColor({}, "brandBackground");

  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getSession) return;
    const loadChats = async () => {
      setLoading(true);
      try {
        const response = await listMyChats(getSession.accessToken);
        setChats(response);
      } catch {
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    void loadChats();
  }, [getSession]);

  const filteredChats = useMemo(() => {
    if (!searchText.trim()) return chats;
    const term = searchText.toLowerCase();
    return chats.filter((chat) => {
      const nameMatch = chat.name?.toLowerCase().includes(term);
      const participantMatch = chat.participants.some((p) =>
        p.name.toLowerCase().includes(term)
      );
      return nameMatch || participantMatch;
    });
  }, [chats, searchText]);

  const getChatTitle = (chat: ChatResponse) => {
    if (chat.name && chat.name.trim().length > 0) {
      return chat.name;
    }
    const others = chat.participants.filter(
      (p) => p.id !== getSession?.user?.id
    );
    if (others.length === 0) return "Chat";
    if (others.length === 1) return others[0].name;
    return others.map((p) => p.name).join(", ");
  };

  const getLastMessagePreview = (chat: ChatResponse) => {
    if (!chat.lastMessage) return "Nenhuma mensagem";
    return chat.lastMessage.message;
  };

  if (!getSession) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Faça login para ver suas conversas.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedView
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <ThemedTextInput
            placeholder="Buscar"
            style={{ width: "100%" }}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={() => null}
          />
          <Card.Icon name="magnifyingglass" />
        </ThemedView>

        <Pressable
          style={[
            styles.newChatButton,
            { backgroundColor: brand as any },
            !getSession && styles.disabledButton,
          ]}
          onPress={() => router.push("/chat/create")}
          disabled={!getSession}
        >
          <IconSymbol name="person.2.fill" size={18} color="#ffffff" />
          <ThemedText style={styles.newChatText}>Novo chat</ThemedText>
        </Pressable>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          >
            {chats.length > 0 &&
              filteredChats.map((chat) => (
                <Card.Root
                  key={chat.id}
                  style={styles.card}
                  onPress={() => router.push(`/chat/${chat.id}`)}
                >
                  <Card.Avatar uri="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/07/Avatar-Fogo-e-Cinzas.png?w=1200&h=900&crop=0" />
                  <View style={styles.cardBody}>
                    <Card.Title
                      title={getChatTitle(chat)}
                      subtitle={getLastMessagePreview(chat)}
                    />
                    <View style={styles.metaRow}>
                      <ThemedText type="defaultSemiBold" lightColor="#666">
                        {formatTimeOrDate(chat.lastMessage?.sentAt)}
                      </ThemedText>
                      {chat.hasUnreadMessages ? (
                        <View style={styles.unreadDot} />
                      ) : null}
                    </View>
                  </View>
                  <Card.Icon name="chevron.right" />
                </Card.Root>
              ))}

            {!filteredChats.length && (
              <View style={styles.emptyContainer}>
                <ThemedText type="title">Ops!</ThemedText>
                <ThemedText style={styles.emptyText}>
                  Nenhum chat encontrado.
                </ThemedText>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
    justifyContent: "center",
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 12,
    alignContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  newChatText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
  listContent: {
    gap: 12,
    alignItems: "center",
    paddingBottom: 16,
  },
  card: {
    width: "100%",
    marginBottom: 12,
  },
  cardBody: {
    flex: 1,
    paddingRight: 8,
    gap: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1e88e5",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
  },
});
