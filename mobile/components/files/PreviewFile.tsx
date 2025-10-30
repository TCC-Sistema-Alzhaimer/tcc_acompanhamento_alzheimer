import { FileInfoDTO } from "@/types/domain/files";
import { Image, View } from "react-native";
import { WebView } from "react-native-webview";
import { ThemedText } from "../ThemedText";

interface PreviewFileProps {
  description: string;
  file: FileInfoDTO;
}

export function PreviewFile({ description, file }: PreviewFileProps) {
  return (
    <View>
      <View>
        {file.isImage ? (
          <Image
            source={{ uri: file.downloadLink }}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        ) : file.isPdf && file.downloadLink ? (
          <WebView
            source={{ uri: file.downloadLink as string }}
            style={{ height: 200 }}
          />
        ) : null}
      </View>
      <View>
        <ThemedText type="title">{description}</ThemedText>
        <ThemedText>{file.name}</ThemedText>
      </View>
    </View>
  );
}
