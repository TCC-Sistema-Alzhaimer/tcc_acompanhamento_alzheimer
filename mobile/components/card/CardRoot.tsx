import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../ThemedView";

interface CardRootProps {
  children: React.ReactNode;
  style?: object;
  themed?: boolean;
  onPress?: () => void;
}

export function CardRoot({ children, style, themed, onPress }: CardRootProps) {
  const bgColor = useThemeColor({}, "secondaryBackground");

  return (
    <>
      <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
        {themed ? (
          <ThemedView
            style={[styles.container, style, { backgroundColor: bgColor }]}
          >
            {children}
          </ThemedView>
        ) : (
          <View style={[styles.container, style]}>{children}</View>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#666",
    borderWidth: 1,
    borderColor: "#555",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    width: "100%",
  },
});
