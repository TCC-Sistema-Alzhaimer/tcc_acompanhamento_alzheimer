import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface CardAvatarProps {
  uri: string;
  size?: number;
}

export function CardAvatar({ uri, size = 40 }: CardAvatarProps) {
  return (
    <View style={styles.container}>
      <Image
        source={uri}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        contentFit="cover"
        transition={1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    justifyContent: "center",
  },
});
