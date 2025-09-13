import { Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="exam/index"
        options={{
          title: "Exames",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
