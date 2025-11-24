import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import { fetchPatientById } from "@/services/patient-service";
import { GENDER } from "@/types/enum/gender";
import { Roles } from "@/types/enum/roles";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function StartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const session = useSession();
  const { state, selectPatient } = useSelectedPatient();

  useEffect(() => {
    if (authLoading || !state.hydrated) {
      return;
    }
    if (user == null) {
      router.replace("/login");
      return;
    }

    if (user.role === Roles.PATIENT) {
      const patientId = String(user.id);
      if (state.patientId !== patientId) {
        (async () => {
          try {
            const resp = await fetchPatientById({
              accessToken: session?.accessToken || "",
              patientId: patientId,
            });
            await selectPatient({
              id: user.id,
              email: user.email,
              name: resp.name,
              cpf: resp.cpf,
              phone: resp.phone,
              gender: GENDER.MALE,
              address: resp.address,
              birthdate: resp.birthdate,
              doctorEmails: resp.doctorEmails || [],
              caregiverEmails: resp.caregiverEmails || [],
            });
          } finally {
            router.replace("/home");
          }
        })();
      } else {
        router.replace("/home");
      }
      return;
    }

    if (
      user.role === Roles.CAREGIVER ||
      user.role === Roles.DOCTOR ||
      user.role === Roles.ADMINISTRATOR
    ) {
      if (state.patientId) {
        router.replace("/home");
      } else {
        router.replace("/selecter-patient");
      }
      return;
    }

    router.replace("/login");
  }, [
    authLoading,
    router,
    selectPatient,
    state.hydrated,
    state.patientId,
    user,
  ]);

  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ActivityIndicator />
    </ThemedView>
  );
}
