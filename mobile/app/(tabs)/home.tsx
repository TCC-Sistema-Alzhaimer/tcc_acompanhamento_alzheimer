import { Card } from "@/components/card/Card";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeNewScreen() {
  const router = useRouter();

  const { logout } = useAuth();
  const { state } = useSelectedPatient();

  useEffect(() => {
    console.log("Selected patient ID:", state.patientId);
  }, [router, state.patientId]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Card.Root themed={false} onPress={() => console.log("Card pressed")}>
          <Card.Title
            title="Welcome Back!"
            subtitle="Here's your summary for today."
          />
          <Card.Icon
            name="rectangle.portrait.and.arrow.right"
            onPress={logout}
          />
        </Card.Root>
      </View>

      <View style={styles.content}>
        <Card.Root themed={false} onPress={() => router.push("/exam")}>
          <Card.Avatar uri="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/07/Avatar-Fogo-e-Cinzas.png?w=1200&h=900&crop=0" />
          <Card.Title
            title="Exames"
            subtitle="Verifique e adicione novos exames."
          />
          <Card.Icon name="paperplane.fill" />
        </Card.Root>

        <Card.Root themed={false} onPress={() => router.push("/conclusion")}>
          <Card.Avatar />
          <Card.Title
            title="Conclusões médicas"
            subtitle="Visualize suas conclusões médicas."
          />
          <Card.Icon
            name="paperplane.fill"
            onPress={() => router.push("/conclusion")}
          />
        </Card.Root>
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
    borderColor: "#444", // cor mais sutil para fundo preto
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
});
