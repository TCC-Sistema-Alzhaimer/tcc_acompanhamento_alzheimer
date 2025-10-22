import { useState, useEffect } from "react";
import { getPatientsByDoctor } from "~/services/doctorService";
import type { PatientModel } from "~/types/roles/models";

interface UsePatientListProps {
  doctorId: number;
  query: string;
}

export function usePatientList({ doctorId, query }: UsePatientListProps) {
  const [patients, setPatients] = useState<PatientModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = () => {
      if (!doctorId) {
        setIsLoading(false);
        setPatients([]);
        return;
      }

      setIsLoading(true);

      getPatientsByDoctor(doctorId, query)
        .then((data) => {
          setPatients(data);
        })
        .catch((error) => {
          console.error("Erro pego no hook:", error);
          setPatients([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchPatients();
  }, [doctorId, query]);

  return { patients, isLoading };
}
