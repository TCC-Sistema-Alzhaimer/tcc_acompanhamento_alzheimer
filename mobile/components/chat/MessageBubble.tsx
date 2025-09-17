import { Msg } from "@/app/(stack)/chat/[id]";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";

export function MessageBubble({ text, time, variant }: Msg) {
  const muted = useThemeColor({}, "placeholder");
  const bgIncoming = useThemeColor({}, "background");
  const bgOutgoing = useThemeColor({}, "brandBackground");

  const isOut = variant === "out";

  return (
    <View
      style={[
        styles.bubbleGroup,
        isOut ? { alignItems: "flex-end" } : { alignItems: "flex-start" },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOut
            ? [styles.bubbleRight, { backgroundColor: bgOutgoing }]
            : [styles.bubbleLeft, { backgroundColor: bgIncoming }],
        ]}
      >
        <ThemedText
          lightColor={isOut ? "#fff" : undefined}
          darkColor={isOut ? "#fff" : undefined}
          style={styles.bubbleText}
        >
          {text}
        </ThemedText>
      </View>
      <ThemedText
        lightColor={muted}
        darkColor={muted}
        style={[
          styles.time,
          isOut ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" },
        ]}
      >
        {time}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleGroup: {
    maxWidth: "100%",
  },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bubbleLeft: {
    alignSelf: "flex-start",
    // canto inferior-esquerdo um pouco mais fechado (efeito "balão")
    borderBottomLeftRadius: 6,
  },
  bubbleRight: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 6,
  },
  bubbleText: {
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    marginTop: 4, // timestamp colado na bolha
  },
});
