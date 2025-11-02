import { Card } from "@/components/card/Card";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import { Roles } from "@/types/enum/roles";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomeNewScreen() {
  const router = useRouter();

  const { logout } = useAuth();
  const session = useSession();
  const { state, clearSelection } = useSelectedPatient();

  const handleLogout = () => {
    clearSelection();
    logout();
  };

  const patientName =
    session?.user.role === Roles.PATIENT
      ? "Seu painel " + state.cachedPatient?.name || ""
      : "Visualizando " + (state.cachedPatient?.name || "nenhum paciente");

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Card.Root themed={false} onPress={() => console.log("Card pressed")}>
          <Card.Title title="Bem vindo de volta!" subtitle={patientName} />
          <Card.Icon
            name="rectangle.portrait.and.arrow.right"
            onPress={handleLogout}
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

        <Card.Root themed={false} onPress={() => router.push("/association")}>
          <Card.Avatar />
          <Card.Title
            title="Pedidos de Associações"
            subtitle="Visualize os pedidos referente ao paciente."
          />
          <Card.Icon
            name="paperplane.fill"
            onPress={() => router.push("/association")}
          />
        </Card.Root>

        <Card.Root themed={false} onPress={() => router.push("/historic")}>
          <Card.Avatar />
          <Card.Title
            title="Histórico de Exames"
            subtitle="Visualize e anexe os exames antigos do paciente."
          />
          <Card.Icon
            name="paperplane.fill"
            onPress={() => router.push("/historic")}
          />
        </Card.Root>

        {session?.user.role !== Roles.PATIENT && (
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Card.Root
              themed={false}
              onPress={() => router.push("/selecter-patient")}
            >
              <Card.Avatar />
              <Card.Title
                title="Pacientes"
                subtitle="Selecione ou adicione um novo paciente."
              />
              <Card.Icon
                name="person.2.fill"
                onPress={() => router.push("/selecter-patient")}
              />
            </Card.Root>
          </View>
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
    borderColor: "#444", // cor mais sutil para fundo preto
  },
  content: {
    flex: 1,
    gap: 12,
    alignContent: "center",
    justifyContent: "flex-start",
    padding: 16,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
  },
});
