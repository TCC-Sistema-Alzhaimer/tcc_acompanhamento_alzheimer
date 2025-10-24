import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/hooks/useSession";
import { fetchAssociationById } from "@/services/association-service";
import { AssociationResponseDto } from "@/types/api/association";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function AssociationDetailScreen() {
  const { id } = useLocalSearchParams();
  const [association, setAssociation] = useState<AssociationResponseDto | null>(
    null
  );

  const session = useSession();

  useEffect(() => {
    if (session != null && session.accessToken && id) {
      const accessToken = session.accessToken;
      const associationId = id as string;

      async function loadAssociation() {
        const resp = await fetchAssociationById({
          accessToken,
          associationId,
        });
        setAssociation(resp);
      }
      void loadAssociation();
    }
  }, [session?.accessToken, id]);

  if (!association) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Carregando detalhes da associação...</ThemedText>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Detalhes da associacao</ThemedText>
      <ThemedView>
        <ThemedText type="subtitle">Tipo: {association.type}</ThemedText>
        <ThemedText>Criação por: {association.creatorEmail}</ThemedText>
        <ThemedText>Relacionando</ThemedText>
        <View>
          <ThemedText>Paciente: {association.patient.name}</ThemedText>
          <ThemedText>COM</ThemedText>
          <ThemedText>Cuidador: {association.relation.name}</ThemedText>
        </View>
      </ThemedView>
      <ThemedView></ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
