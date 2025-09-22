import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ConclusionScreen() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedView type="default" style={{ padding: 16, borderRadius: 8 }}>
        <ThemedText type="title">Conclusões Médicas</ThemedText>
        <ThemedText type="default" style={{ marginTop: 8 }}>
          Aqui você pode visualizar suas conclusões médicas.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
