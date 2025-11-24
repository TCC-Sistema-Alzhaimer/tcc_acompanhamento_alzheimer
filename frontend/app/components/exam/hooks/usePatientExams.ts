import { useState, useEffect } from "react";
import { getPatientExams } from "~/services/doctorService";
import type { ExamResponse } from "~/types/exam/examResponse";

export function usePatientExams(patientId: number | null) {
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patientId === null) {
      setExams([]);
      return;
    }

    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const data = await getPatientExams(patientId);
        setExams(data);
      } catch (error) {
        console.error("Erro ao buscar exames do paciente:", error);
        setExams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [patientId]);

  return { exams, isLoading };
}
