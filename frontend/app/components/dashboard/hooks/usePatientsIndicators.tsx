import { useState, useEffect } from "react";
// 1. Importe a nova função e o DTO
import { getPatientIndicators } from "~/services/doctorService";
import type { IndicatorResponse } from "~/types/dashboard/IndicatorResponse";

export function usePatientIndicators(patientId: number | null) {
  // 2. O estado armazena UMA lista de indicadores
  const [indicators, setIndicators] = useState<IndicatorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patientId === null) {
      setIndicators([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getPatientIndicators(patientId);
        setIndicators(result);
      } catch (error) {
        console.error("Erro no hook usePatientIndicators:", error);
        setIndicators([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  return { indicators, isLoading };
}
