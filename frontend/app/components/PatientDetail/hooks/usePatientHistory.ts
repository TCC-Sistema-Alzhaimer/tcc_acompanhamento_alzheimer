import { useState, useEffect } from "react";
import { getPatientExams } from "~/services/doctorService";
import type { ExamResponse } from "~/types/exam/examResponse";

export function usePatientHistory(patientId: number | null) {
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patientId === null) {
      setExams([]);
      return;
    }

    const fetchHistory = () => {
      setIsLoading(true);
      getPatientExams(patientId)
        .then((data) => {
          setExams(data);
        })
        .catch((error) => {
          console.error("Erro pego no hook de histórico:", error);
          setExams([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchHistory();
  }, [patientId]);
  return { exams, isLoading };
}
