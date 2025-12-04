import { useState, useEffect, useCallback } from "react";
import { FileText } from "lucide-react";
import type { ExamResponse } from "~/types/exam/examResponse";
import { getExamsByDoctor, getExamsByPatient } from "~/services/examService";
import { ExamListItem } from "./ExamListItem";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  ListHeader,
  ListContainer,
  ListContent,
} from "~/components/ui";

interface ExamListProps {
  doctorId?: number;
  patientId?: number;
  onSelectExam: (exam: ExamResponse) => void;
  selectedExamId?: number | null;
}

export function ExamList({
  doctorId,
  patientId,
  onSelectExam,
  selectedExamId,
}: ExamListProps) {
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (patientId) {
        response = await getExamsByPatient(patientId);
      } else if (doctorId) {
        response = await getExamsByDoctor(doctorId);
      } else {
        setExams([]);
        return;
      }
      setExams(response.data);
    } catch (err) {
      console.error("Erro ao buscar exames:", err);
      setError("Erro ao carregar exames");
    } finally {
      setIsLoading(false);
    }
  }, [doctorId, patientId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  if (isLoading) {
    return <LoadingState message="Carregando exames..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchExams} />;
  }

  if (exams.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Nenhum exame encontrado"
        description={
          patientId
            ? "Este paciente não possui exames solicitados."
            : "Você ainda não solicitou nenhum exame."
        }
      />
    );
  }

  return (
    <ListContainer>
      <ListHeader
        count={exams.length}
        singular="exame"
        plural="exames"
        onRefresh={fetchExams}
      />

      <ListContent maxHeight="500px">
        {exams.map((exam) => (
          <ExamListItem
            key={exam.id}
            exam={exam}
            isSelected={selectedExamId === exam.id}
            onClick={() => onSelectExam(exam)}
          />
        ))}
      </ListContent>
    </ListContainer>
  );
}
