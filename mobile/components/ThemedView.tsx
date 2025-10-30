import { useThemeColor } from "@/hooks/useThemeColor";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "secondary";
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...otherProps
}: ThemedViewProps) {
  const token = type === "secondary" ? "secondaryBackground" : "background";
  const backgroundColor: any = useThemeColor(
    { light: lightColor, dark: darkColor },
    token
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
