import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import { fetchPatientsByCaregiver } from "@/services/caregiver-service";
import { fetchPatients } from "@/services/patient-service";
import { Patient } from "@/types/domain/patient";
import { Roles } from "@/types/enum/roles";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function SelecterPatient() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const router = useRouter();
  const { loading } = useAuth();
  const session = useSession();
  const { selectPatient } = useSelectedPatient();

  useEffect(() => {
    const fetchPatient = async () => {
      if (session?.accessToken) {
        console.log("Fetching patients for user:", session.user);
        if (session.user.role == Roles.CAREGIVER) {
          const resp = await fetchPatientsByCaregiver({
            caregiverId: String(session.user.id),
            accessToken: session.accessToken,
          });
          setPatients(resp);
        } else {
          const resp = await fetchPatients({
            accessToken: session.accessToken,
          });
          setPatients(resp);
        }
      }
    };

    fetchPatient();
  }, [session?.accessToken]);

  const handlePatientSelect = async (patient: Patient) => {
    await selectPatient(patient);
    router.replace("/home");
  };

  if (loading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

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
