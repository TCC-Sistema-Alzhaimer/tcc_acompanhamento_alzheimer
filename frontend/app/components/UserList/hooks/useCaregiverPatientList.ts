import { useState, useEffect, useCallback } from "react";
import { getPatientsByCaregiver } from "~/services/caregiverService";
import type { BasicListModel } from "~/types/roles/models";

interface Props {
  caregiverId: number;
  query: string;
}

export function useCaregiverPatientList({ caregiverId, query }: Props) {
  const [patients, setPatients] = useState<BasicListModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = useCallback(() => {
    if (!caregiverId) {
      setPatients([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getPatientsByCaregiver(caregiverId, query)
      .then((data) => setPatients(data))
      .catch(() => setPatients([]))
      .finally(() => setIsLoading(false));
  }, [caregiverId, query]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, isLoading, refetch: fetchPatients };
}
