import { Card } from "@/components/card/Card";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/hooks/useSession";
import { Roles } from "@/types/enum/roles";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeNewScreen() {
  const router = useRouter();

  const session = useSession();

  return (
    <ThemedView style={styles.container}>
      {session?.user.role !== Roles.PATIENT && (
        <View style={styles.header}>
          <Card.Root onPress={() => router.push("/selecter-patient")}>
            <Card.Avatar uri="https://cdn.pixabay.com/photo/2025/01/16/05/01/assist-9336328_1280.jpg" />
            <Card.Title
              title="Pacientes"
              subtitle="Selecione um paciente para visualizar."
            />
            <Card.Icon
              name="person.3.fill"
              onPress={() => router.push("/selecter-patient")}
            />
          </Card.Root>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Card.Root onPress={() => router.push("/exam")}>
            <Card.Avatar uri="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/07/Avatar-Fogo-e-Cinzas.png?w=1200&h=900&crop=0" />
            <Card.Title
              title="Exames"
              subtitle="Verifique e adicione novos exames."
            />
            <Card.Icon name="waveform.path.ecg" />
          </Card.Root>

          <Card.Root onPress={() => router.push("/conclusion")}>
            <Card.Avatar uri="https://cdn.pixabay.com/photo/2016/02/29/15/01/doctor-1228627_1280.jpg" />
            <Card.Title
              title="Conclusões médicas"
              subtitle="Visualize suas conclusões médicas."
            />
            <Card.Icon
              name="doc.text.magnifyingglass"
              onPress={() => router.push("/conclusion")}
              type="primary"
            />
          </Card.Root>

          <Card.Root onPress={() => router.push("/association")}>
            <Card.Avatar uri="https://cdn.pixabay.com/photo/2016/12/19/10/16/hands-1917895_1280.png" />
            <Card.Title
              title="Pedidos de Associações"
              subtitle="Visualize os pedidos referente ao paciente."
            />
            <Card.Icon
              name="link.circle.fill"
              onPress={() => router.push("/association")}
            />
          </Card.Root>

          <Card.Root onPress={() => router.push("/historic")}>
            <Card.Avatar uri="https://cdn.pixabay.com/photo/2015/02/06/18/38/folder-626332_1280.jpg" />
            <Card.Title
              title="Histórico de Exames"
              subtitle="Visualize e anexe os exames antigos do paciente."
            />
            <Card.Icon
              name="archivebox.fill"
              onPress={() => router.push("/historic")}
            />
          </Card.Root>
        </View>
      </ScrollView>
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
    borderColor: "#444",
  },
  scrollContent: {
    paddingBottom: 32, // espaço para o final do scroll
  },
  content: {
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    flexGrow: 1,
  },
});
