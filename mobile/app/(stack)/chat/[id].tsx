import { Card } from "@/components/card/Card";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { Doctor, DoctorMocks } from "@/mocks/doctor-mock";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    const doctorData = DoctorMocks.find((doc) => String(doc.id) === String(id));
    setDoctor(doctorData || null);
  }, [id]);

  return (
    <ThemedView style={styles.container}>
      {doctor ? (
        <>
          {/* HEADER */}
          <View style={styles.header}>
            <Card.Root themed={true} style={styles.headerCard}>
              <Card.Avatar uri="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/07/Avatar-Fogo-e-Cinzas.png?w=1200&h=900&crop=0" />
              <Card.Title
                title={doctor.name}
                subtitle="Ultima consulta: 12/06/2024"
              />
            </Card.Root>
          </View>

          {/* MENSAGENS */}
          <ThemedView type="secondary" style={styles.content}>
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bottomOffset={20}
            >
              {MESSAGES.map((m) => (
                <MessageBubble key={m.id} {...m} />
              ))}
            </KeyboardAwareScrollView>
          </ThemedView>

          {/* INPUT STICKY */}
          <KeyboardStickyView
            style={[styles.stickyFooter]}
            offset={{ closed: 0, opened: 0 }}
          >
            <Card.Root themed={true}>
              <ThemedTextInput
                placeholder="Digite sua mensagem..."
                style={styles.input}
                returnKeyType="send"
              />
              <Card.Icon name="paperplane.fill" onPress={() => {}} />
            </Card.Root>
          </KeyboardStickyView>
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
    paddingHorizontal: 16,
  },

  header: {
    marginTop: 16,
    marginBottom: 12,
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

  stickyFooter: {
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "rgba(30,30,30,0.96)", // dark responsivo
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",

    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 0,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    minHeight: 50,
  },
});
