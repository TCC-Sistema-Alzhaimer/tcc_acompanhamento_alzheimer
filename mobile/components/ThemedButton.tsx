import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ThemedButtonProps {
  type?: "primary" | "secondary" | "danger" | "disabled";
  title: string;
  onPress?: () => void;
}

export function ThemedButton({
  type = "primary",
  title,
  onPress,
}: ThemedButtonProps) {
  const theme = useColorScheme() ?? "light";
  const buttonColors = Colors[theme].button;

  let backgroundColor = buttonColors.primaryBackground;
  let textColor = buttonColors.primaryText;

  switch (type) {
    case "secondary":
      backgroundColor = buttonColors.secondaryBackground;
      textColor = buttonColors.secondaryText;
      break;
    case "danger":
      backgroundColor = buttonColors.dangerBackground;
      textColor = buttonColors.dangerText;
      break;
    case "disabled":
      backgroundColor = buttonColors.disabledBackground;
      textColor = buttonColors.disabledText;
      break;
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={type !== "disabled" ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
  },
});
