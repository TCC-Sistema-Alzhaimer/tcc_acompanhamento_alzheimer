// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "envelope.fill": "email",
  "bell.fill": "notifications",
  "person.crop.circle": "account-circle",
  "rectangle.portrait.and.arrow.right": "logout",
  magnifyingglass: "search",
  "gearshape.fill": "settings",
  "xmark.circle.fill": "cancel",
  "checkmark.circle.fill": "check-circle",
  "paperclip.circle.fill": "attach-file",
  "tablecells.fill": "grid-view",
  "photo.on.rectangle.angled": "photo-library",
  "doc.fill": "description",
  "doc.plaintext.fill": "description",
  "doc.richtext.fill": "note",

  "cross.case.fill": "biotech",
  "bandage.fill": "science",
  "waveform.path.ecg": "monitor-heart",

  // Conclusões médicas
  stethoscope: "medical-information", // 🩺
  "doc.text.magnifyingglass": "assignment", // relatório médico

  "person.2.fill": "groups", // 👥
  "person.2.wave.2.fill": "handshake", // 🤝
  "link.circle.fill": "link", // conexões

  "clock.arrow.circlepath": "history", // 🕒
  calendar: "calendar-today", // 🗓️
  "archivebox.fill": "folder", // 🗂️

  "person.fill": "person",
  "person.3.fill": "groups",
  "heart.text.square.fill": "favorite", // ❤️
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
