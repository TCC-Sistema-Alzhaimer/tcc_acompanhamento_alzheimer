import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import { fetchAssociations } from "@/services/association-service";
import { AssociationResponseDto } from "@/types/api/association";
import { formatAssociationType } from "@/util/format";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
export default function AssociationListScreen() {
  const [associations, setAssociations] = useState<AssociationResponseDto[]>(
    []
  );

  const router = useRouter();
  const session = useSession();
  const { state } = useSelectedPatient();

  useEffect(() => {
    if (session != null && session.accessToken) {
      const accessToken = session.accessToken;
      const patientId = state.patientId || undefined;

      async function loadAssociations() {
        const resp = await fetchAssociations({
          accessToken,
          patientId,
        });
        setAssociations(resp);
      }

      void loadAssociations();
    }
  }, [session?.accessToken, state.patientId]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Associações
      </ThemedText>
      <ScrollView>
        {associations.map((association) => (
          <Card.Root
            key={association.id}
            style={{ marginBottom: 16 }}
            onPress={() => router.push(`/association/${association.id}`)}
          >
            <Card.Title
              title={formatAssociationType(association.type)}
              subtitle={association.creatorEmail}
            />
            <Card.Icon name="person.2.fill" />
          </Card.Root>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    marginBottom: 16,
    textAlign: "center",
  },
});
