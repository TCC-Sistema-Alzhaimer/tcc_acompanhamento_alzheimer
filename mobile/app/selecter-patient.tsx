import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/hooks/useSession";
import { useEffect } from "react";

export default function SelecterPatient() {
  const session = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  if (session == null) {
    return (
      <ThemedView>
        <ThemedText>Carregando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      <ThemedText>Seleção de Paciente</ThemedText>
    </ThemedView>
  );
}
