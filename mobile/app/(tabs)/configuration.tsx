import { Card } from "@/components/card/Card";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";

const aboutText = `Este aplicativo foi desenvolvido para auxiliar no monitoramento e gestão de pacientes com Alzheimer. Ele oferece funcionalidades como registro de exames, acompanhamento de conclusões médicas e notificações importantes. Nosso objetivo é proporcionar uma melhor qualidade de vida para os pacientes e facilitar o trabalho dos cuidadores e profissionais de saúde.`;

export default function TabTwoScreen() {
  const { logout } = useAuth();
  const { clearSelection } = useSelectedPatient();
  const router = useRouter();

  const [openAbout, setOpenAbout] = useState(false);

  const handleAboutPress = () => {
    setOpenAbout(!openAbout);
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      clearSelection();
      logout();
      return;
    }
    Alert.alert(
      "Sair do aplicativo",
      "Tem certeza que deseja desconectar sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            clearSelection();
            logout();
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Configurações</ThemedText>
      </View>
      <View style={styles.content}>
        <Card.Root onPress={() => router.push("/profile")}>
          <Card.Title title="Minha conta" />
        </Card.Root>
        <Card.Root onPress={() => handleAboutPress()} style={{ width: "100%" }}>
          <Card.Title
            title="Sobre o aplicativo"
            subtitle={openAbout ? aboutText : ""}
          />
        </Card.Root>
      </View>
      <ThemedView style={styles.footer}>
        <ThemedButton
          title="Sair da conta"
          type="danger"
          onPress={handleLogout}
        >
          <Card.Icon name="rectangle.portrait.and.arrow.right" type="danger" />
        </ThemedButton>

        <ThemedText style={styles.versionText}>
          Desenvolvido por Gabriel H. S. | João P. C. G.| Lucca H. M. C. P. S. |
          Wesley P.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  content: {
    borderColor: "#444",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    gap: 12,
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  footer: {
    marginTop: 20,
    gap: 16,
    width: "100%",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.4,
  },
});
