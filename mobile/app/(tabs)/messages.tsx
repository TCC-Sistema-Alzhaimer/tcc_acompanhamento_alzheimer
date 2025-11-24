import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { listMyChats } from "@/services/chat-service";
import { ChatResponse } from "@/types/api/chat";
import { formatTimeOrDate } from "@/util/format";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function MessagesScreen() {
  const router = useRouter();
  const { getSession } = useAuth();

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
      } finally {
        setLoading(false);
      }
    };

    void loadChats();
  }, [getSession]);

  const filteredChats = useMemo(() => {
    console.log("Filtering chats with search text:", chats);
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
        <Card.Root themed={false} style={styles.search}>
          <ThemedTextInput
            placeholder="Buscar"
            style={{ width: "100%" }}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={() => null}
          />
          <Card.Icon name="magnifyingglass" />
        </Card.Root>
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
                  themed={false}
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
    flex: 0.2,
    marginBottom: 16,
    justifyContent: "center",
    borderColor: "#555",
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

  search: {
    width: "100%",
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
