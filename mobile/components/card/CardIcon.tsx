import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconSymbol, IconSymbolName } from "../ui/IconSymbol";

interface CardIconProps {
  name: IconSymbolName;
  onPress?: () => void;
  type?: "primary" | "secondary" | "danger" | "disabled";
}

export function CardIcon({ name, onPress, type = "primary" }: CardIconProps) {
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
    <TouchableOpacity style={styles.container} onPress={onPress || undefined}>
      <View style={[styles.subContainer, { backgroundColor }]}>
        <IconSymbol name={name} size={18} weight="medium" color={textColor} />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  subContainer: {
    backgroundColor: "#f0f0f0",
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
