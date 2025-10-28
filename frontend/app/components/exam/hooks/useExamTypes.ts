import { useState, useEffect } from "react";
import { getExamTypes } from "~/services/doctorService";
import type { ExamType } from "~/types/exam/examType";

export function useExamTypes() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExamTypes = async () => {
      setIsLoading(true);
      try {
        const data = await getExamTypes();
        setExamTypes(data);
      } catch (error) {
        console.error("Erro ao buscar tipos de exame no hook:", error);
        setExamTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamTypes();
  }, []);

  return { examTypes, isLoading };
}
