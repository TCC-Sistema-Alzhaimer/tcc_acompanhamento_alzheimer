import { Card } from "@/components/card/Card";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { Doctor, DoctorMocks } from "@/mocks/doctor-mock";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export type Msg = {
  id: string;
  text: string;
  time: string;
  variant: "in" | "out";
};

const MESSAGES: Msg[] = [
  {
    id: "1",
    text: "Bom dia! Como o Sr. João está se sentindo hoje?",
    time: "09:15",
    variant: "in",
  },
  {
    id: "2",
    text: "Ele está melhor, doutor! A febre baixou.",
    time: "09:30",
    variant: "out",
  },
  {
    id: "3",
    text: "Ótimo! Não esqueça de enviar os resultados do exame que solicitei.",
    time: "09:45",
    variant: "in",
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const doctorData = DoctorMocks.find((doc) => String(doc.id) === String(id));
    setDoctor(doctorData || null);
  }, [id]);

  return (
    <ThemedView style={styles.container}>
      {doctor ? (
        <>
          <View style={styles.header}>
            <Card.Root themed={true} style={styles.headerCard}>
              <Card.Avatar uri="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/07/Avatar-Fogo-e-Cinzas.png?w=1200&h=900&crop=0" />
              <Card.Title
                title={doctor.name}
                subtitle="Última mensagem: há 2 horas"
              />
            </Card.Root>
          </View>

          <ThemedView type="secondary" style={styles.content}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.messages}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {MESSAGES.map((m) => (
                <MessageBubble key={m.id} {...m} />
              ))}
            </ScrollView>
          </ThemedView>

          <View style={styles.footer}>
            <Card.Root themed={false} style={styles.inputRow}>
              <ThemedTextInput
                placeholder="Digite sua mensagem..."
                style={styles.input}
                returnKeyType="send"
              />
              <Card.Icon name="paperplane.fill" onPress={() => {}} />
            </Card.Root>
          </View>
        </>
      ) : (
        <ThemedText type="title">Loading...</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
    justifyContent: "center",
  },
  headerCard: {
    padding: 12,
    borderRadius: 10,
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
});
