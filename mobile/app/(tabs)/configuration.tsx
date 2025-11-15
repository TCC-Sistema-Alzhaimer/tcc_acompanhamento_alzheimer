import { Card } from "@/components/card/Card";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const aboutText = `Este aplicativo foi desenvolvido para auxiliar no monitoramento e gestão de pacientes com Alzheimer. Ele oferece funcionalidades como registro de exames, acompanhamento de conclusões médicas e notificações importantes. Nosso objetivo é proporcionar uma melhor qualidade de vida para os pacientes e facilitar o trabalho dos cuidadores e profissionais de saúde.`;

export default function TabTwoScreen() {
  const [openAbout, setOpenAbout] = useState(false);

  const router = useRouter();

  const handleAboutPress = () => {
    setOpenAbout(!openAbout);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Card.Root themed={false} onPress={() => router.push("/profile")}>
          <Card.Title title="Minha conta" />
        </Card.Root>
        <Card.Root
          themed={false}
          onPress={() => handleAboutPress()}
          style={{ width: "100%" }}
        >
          <Card.Title
            title="Sobre o aplicativo"
            subtitle={openAbout ? aboutText : ""}
          />
        </Card.Root>
      </View>
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
});
