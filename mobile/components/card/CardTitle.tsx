import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";

interface CardTitleProps {
  title: string;
  subtitle?: string;
  style?: object;
}

export function CardTitle({ title, subtitle, style }: CardTitleProps) {
  return (
    <View style={[styles.viewContainer, style]}>
      <ThemedText style={styles.title} type="title">
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText style={styles.subtitle} type="subtitle">
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    marginBottom: 0,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
