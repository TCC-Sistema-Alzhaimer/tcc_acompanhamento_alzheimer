import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface InfoFieldProps {
  label: string;
  value: string | undefined;
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <View>
      <ThemedText type="secondary">{label}</ThemedText>
      <ThemedView
        type="default"
        style={{ padding: 8, borderRadius: 4, marginTop: 4 }}
      >
        <ThemedText>{value}</ThemedText>
      </ThemedView>
    </View>
  );
}
