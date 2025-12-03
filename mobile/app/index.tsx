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
  const { getSession } = useAuth();
  const session = useSession();
  const { state, selectPatient } = useSelectedPatient();

  useEffect(() => {
    if (!state.hydrated || session === undefined) return;

    if (!getSession) {
      router.replace("/login");
      return;
    }

    const user = getSession.user;

    if (user.role === Roles.PATIENT) {
      const patientId = String(user.id);

      if (state.patientId !== patientId) {
        (async () => {
          try {
            const resp = await fetchPatientById({
              accessToken: session?.accessToken || "",
              patientId,
            });

            await selectPatient({
              id: user.id,
              email: user.email,
              name: resp.name,
              cpf: resp.cpf,
              phone: resp.phone,
              gender: resp.gender ?? GENDER.MALE,
              address: resp.address,
              birthdate: resp.birthdate,
              doctorEmails: resp.doctorEmails || [],
              caregiverEmails: resp.caregiverEmails || [],
            });

            router.replace("/home");
          } catch (err) {
            console.error(err);
            router.replace("/login");
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
      router.replace("/home");
      return;
    }

    router.replace("/login");
  }, [getSession, session, state.hydrated, state.patientId, selectPatient]);

  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ActivityIndicator />
    </ThemedView>
  );
}
