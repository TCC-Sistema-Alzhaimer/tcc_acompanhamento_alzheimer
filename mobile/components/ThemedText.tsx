import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "primary"
    | "secondary"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "small";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const secondaryColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondaryText"
  );

  return (
    <Text
      style={[
        { color: color as any },
        type === "default" ? styles.default : undefined,
        type === "primary" ? styles.primary : undefined,
        type === "secondary"
          ? [styles.default, { color: secondaryColor as any }]
          : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "small" ? styles.small : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  primary: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  secondary: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "300",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  small: { fontSize: 12, lineHeight: 18 },
});
