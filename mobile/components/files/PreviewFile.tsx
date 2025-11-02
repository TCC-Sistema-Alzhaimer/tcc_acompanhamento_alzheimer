import { FileInfoDTO } from "@/types/domain/files";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface PreviewFileProps {
  description: string;
  file: FileInfoDTO;
  onPress?: () => void;
}

export function PreviewFile({ description, file, onPress }: PreviewFileProps) {
  return (
    <Pressable onPress={onPress}>
      <ThemedView type="default" style={styles.container}>
        <View>
          {file.isImage ? (
            <Image
              source={{ uri: file.downloadLink }}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          ) : file.isPdf && file.downloadLink ? (
            <WebView
              source={{ uri: file.downloadLink as string }}
              style={{ height: 50 }}
            />
          ) : null}
        </View>
        <View>
          <ThemedText type="primary" style={{ textAlign: "center" }}>
            {description}
          </ThemedText>
          <ThemedText type="secondary">{file.name}</ThemedText>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "center",
  },
});
