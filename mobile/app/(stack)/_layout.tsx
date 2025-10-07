import { Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Stack>
        <Stack.Screen
          name="exam/index"
          options={{
            title: "Exames",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="chat/[id]"
          options={{
            title: "Mensagens",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="exam/[id]"
          options={{
            title: "Detalhes do Exame",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="conclusion/index"
          options={{
            title: "Conclusões Médicas",
            headerShown: true,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
