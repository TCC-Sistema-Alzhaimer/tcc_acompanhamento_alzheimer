/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
export const brandColor = "#5BBFBA";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    placeholder: "#A0A4A8",
    border: "#E2E8F0",
    danger: "#D14343",
    secondaryText: "#3C4852",
    secondaryBackground: "#F5F5F5",
    brandBackground: brandColor,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    placeholder: "#6B7280",
    border: "#374151",
    danger: "#EF4444",
    secondaryText: "#9CA3AF",
    secondaryBackground: "#1F2224",
    brandBackground: brandColor,
  },
};
