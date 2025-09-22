import { useAuth } from "@/context/AuthContext";
import { useRootNavigationState, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const router = useRouter();
  const navState = useRootNavigationState();

  useEffect(() => {
    async function checkToken() {
      if (!navState?.key) return;

      let token = null;
      if (Platform.OS === "web") {
        token = localStorage.getItem("userToken");
      } else {
        token = await SecureStore.getItemAsync("userToken");
      }

      if (!token) {
        router.replace("/login");
      } else if (token) {
        router.replace("/");
      }
    }
    checkToken();
  }, [navState?.key]);

  if (loading || !navState?.key) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}
