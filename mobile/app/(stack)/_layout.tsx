import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
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
          name="chat/create"
          options={{
            title: "Novo chat",
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
        <Stack.Screen
          name="conclusion/[id]"
          options={{
            title: "Detalhes da Conclusão",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="profile/index"
          options={{
            title: "Perfil",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="association/index"
          options={{
            title: "Associações",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="association/[id]"
          options={{
            title: "Associação Detalhes",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="historic/index"
          options={{
            title: "Historico de Exames",
            headerShown: true,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
