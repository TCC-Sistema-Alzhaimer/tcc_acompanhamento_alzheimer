import { useThemeColor } from "@/hooks/useThemeColor";
import React, { forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
};

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
  (
    {
      style,
      lightColor,
      darkColor,
      placeholder,
      onChangeText,
      value,
      label,
      error,
      size = "md",
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const textColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "text"
    ) as string;

    const bgColor = useThemeColor({}, "secondaryBackground") as string;
    const borderColor = useThemeColor({}, "border") as string;
    const placeholderColor = useThemeColor({}, "placeholder") as string;
    const errorColor = useThemeColor({}, "danger") as string;
    const labelColor = useThemeColor({}, "secondaryText") as string;
    const focusColor = useThemeColor({}, "tint") as string;

    const sizeStyle =
      size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;

    return (
      <View style={styles.wrapper}>
        {label ? (
          <Text style={[styles.label, { color: labelColor as any }]}>
            {label}
          </Text>
        ) : null}

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            sizeStyle,
            { color: textColor, backgroundColor: bgColor, borderColor },
            focused && {
              borderColor: focusColor,
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 1,
            },
            !!error && { borderColor: errorColor },
            style,
          ]}
          {...rest}
        />

        {!!error && (
          <Text style={[styles.error, { color: errorColor as any }]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

ThemedTextInput.displayName = "ThemedTextInput";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    lineHeight: 20,
  },
  sm: {
    paddingVertical: 8,
    fontSize: 14,
  },
  md: {
    paddingVertical: 12,
    fontSize: 16,
  },
  lg: {
    paddingVertical: 14,
    fontSize: 18,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
  },
});
