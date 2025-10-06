import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import { fetchPatientsByCaregiver } from "@/services/caregiver-service";
import { Patient } from "@/types/domain/patient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function SelecterPatient() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const router = useRouter();
  const session = useSession();
  const { selectPatient } = useSelectedPatient();

  useEffect(() => {
    const fetchPatient = async () => {
      if (session != null) {
        const resp = await fetchPatientsByCaregiver({
          caregiverId: String(session.user.id),
          accessToken: session.accessToken,
        });
        setPatients(resp);
      }
    };

    fetchPatient();
  }, [session]);

  const handlePatientSelect = async (patient: Patient) => {
    await selectPatient(patient);
    router.replace("/home");
  };

  if (session == null) {
    return (
      <ThemedView>
        <Card.Root onPress={() => router.push("/login")}>
          <Card.Title title="Voltar ao login" />
        </Card.Root>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        Escolha um paciente para continuar
      </ThemedText>
      <ThemedView style={styles.patientList}>
        {patients.map((patient) => (
          <Card.Root onPress={() => handlePatientSelect(patient)}>
            <Card.Title title={patient.name} subtitle={patient.email} />
          </Card.Root>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  patientList: {
    flex: 1,
    marginTop: 16,
    gap: 12,
    justifyContent: "flex-start",
  },
});
