import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { ThemedView } from "../ThemedView";

interface CardRootProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function CardRoot({ children, style, onPress }: CardRootProps) {
  const borderColor: any = useThemeColor({}, "border");

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{ width: "100%" }}
    >
      <ThemedView
        type="card"
        style={[styles.container, { borderColor }, style]}
      >
        {children}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    width: "100%",
  },
});
