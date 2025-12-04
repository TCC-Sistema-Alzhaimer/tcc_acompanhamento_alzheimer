import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View } from "react-native";

interface InfoFieldProps {
  label: string;
  value: string | number;
  addSeparator?: boolean;
}

export function InfoField({
  label,
  value,
  addSeparator = false,
}: InfoFieldProps) {
  const theme = useColorScheme() ?? "light";
  const labelColor = Colors[theme].secondaryText;
  const borderColor = Colors[theme].border;

  return (
    <View
      style={[
        styles.container,
        addSeparator && {
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
      ]}
    >
      <ThemedText style={[styles.label, { color: labelColor }]}>
        {label}
      </ThemedText>

      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
});
