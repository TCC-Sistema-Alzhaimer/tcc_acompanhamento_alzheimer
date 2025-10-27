import { useState, useEffect } from "react";
import { getPatientDetails } from "~/services/doctorService";
import type { PatientModel } from "~/types/roles/models";

export function usePatientDetails(patientId: number | null) {
  const [patient, setPatient] = useState<PatientModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patientId === null) {
      setPatient(null);
      return;
    }

    const fetchDetails = () => {
      setIsLoading(true);
      getPatientDetails(patientId)
        .then((data) => {
          setPatient(data);
        })
        .catch((error) => {
          console.error("Erro pego no hook de detalhes:", error);
          setPatient(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchDetails();
  }, [patientId]);

  return { patient, isLoading };
}
