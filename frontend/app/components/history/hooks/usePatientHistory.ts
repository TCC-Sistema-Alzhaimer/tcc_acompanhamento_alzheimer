import { useEffect, useState } from "react";
import { getPatientHistory } from "~/services/doctorService";
import type { MedicalHistoryResponse } from "~/types/exam/medicalHistoryResponse";

export function usePatientHistory(patientId: number | null) {
  const [history, setHistory] = useState<MedicalHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patientId === null) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      console.log(`Buscando histórico para patientId: ${patientId}`);
      try {
        const data = await getPatientHistory(patientId);
        console.log("Histórico recebido:", data);
        setHistory(data);
      } catch (error) {
        console.error("Erro no hook usePatientHistory:", error);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]);

  return { history, isLoading };
}
