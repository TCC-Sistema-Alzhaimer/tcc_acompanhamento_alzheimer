import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/hooks/useSession";
import { fetchPatientsByCaregiver } from "@/services/caregiver-service";
import { Patient } from "@/types/domain/patient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export default function SelecterPatient() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const router = useRouter();
  const session = useSession();

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

  const handlePatientSelect = (patientId: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem("selectedPatientId", patientId);
    } else {
      SecureStore.setItemAsync("selectedPatientId", patientId);
    }
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
    <ThemedView>
      <ThemedText>Seleção de Paciente</ThemedText>
      {patients.map((patient) => (
        <Card.Root onPress={() => handlePatientSelect(String(patient.id))}>
          <Card.Title title={patient.name} subtitle={patient.email} />
        </Card.Root>
      ))}
    </ThemedView>
  );
}
