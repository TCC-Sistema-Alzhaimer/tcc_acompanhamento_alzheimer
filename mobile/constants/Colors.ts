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

    button: {
      primaryBackground: brandColor,
      primaryText: "#ffffff",
      primaryHover: "#4EB0AB",
      secondaryBackground: "#F5F5F5",
      secondaryText: "#3C4852",
      secondaryHover: "#E2E8F0",
      dangerBackground: "#D14343",
      dangerText: "#ffffff",
      dangerHover: "#B53636",
      disabledBackground: "#E2E8F0",
      disabledText: "#A0A4A8",
    },
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

    button: {
      primaryBackground: brandColor,
      primaryText: "#ffffff",
      primaryHover: "#4EB0AB",
      secondaryBackground: "#1F2224",
      secondaryText: "#ECEDEE",
      secondaryHover: "#2A2D2F",
      dangerBackground: "#EF4444",
      dangerText: "#ffffff",
      dangerHover: "#DC2626",
      disabledBackground: "#374151",
      disabledText: "#6B7280",
    },
  },
};
