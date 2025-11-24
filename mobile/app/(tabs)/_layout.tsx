import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const session = useSession();
  const { loading } = useAuth();
  const {
    state,
    clearSelection,
    loading: loadingSelected,
  } = useSelectedPatient();
  const router = useRouter();

  useEffect(() => {
    if (loading || loadingSelected) {
      return;
    }
    if (!session) {
      router.replace("/login");
      return;
    }
    if (state.patientId == null) {
      clearSelection();
      router.replace("/selecter-patient");
    }
  }, [
    loading,
    router,
    session,
    state.patientId,
    state.hydrated,
    loadingSelected,
  ]);

  if (
    loading ||
    !session ||
    !state.hydrated ||
    state.patientId == null ||
    loadingSelected
  ) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        edges={["top"]}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Mensagens",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="envelope.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: "Notificações",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="bell.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="configuration"
          options={{
            title: "Configurações",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="gearshape.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
