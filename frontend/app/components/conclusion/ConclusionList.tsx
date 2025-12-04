import { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import {
  getPatientConclusions,
  type ConclusionResponseDTO,
} from "~/services/doctorService";
import { ConclusionListItem } from "./ConclusionListItem";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  ListHeader,
  ListContainer,
  ListContent,
} from "~/components/ui";

interface ConclusionListProps {
  patientId: number;
  onSelectConclusion: (conclusion: ConclusionResponseDTO) => void;
  selectedConclusionId?: number | null;
}

export function ConclusionList({
  patientId,
  onSelectConclusion,
  selectedConclusionId,
}: ConclusionListProps) {
  const [conclusions, setConclusions] = useState<ConclusionResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConclusions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPatientConclusions(patientId);
      setConclusions(data);
    } catch (err) {
      console.error("Erro ao buscar conclusões:", err);
      setError("Erro ao carregar conclusões");
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchConclusions();
  }, [fetchConclusions]);

  if (isLoading) {
    return <LoadingState message="Carregando conclusões..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchConclusions} />;
  }

  if (conclusions.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Nenhuma conclusão encontrada"
        description="Este paciente não possui conclusões médicas registradas."
      />
    );
  }

  return (
    <ListContainer>
      <ListHeader
        count={conclusions.length}
        singular="conclusão"
        plural="conclusões"
        onRefresh={fetchConclusions}
      />

      <ListContent>
        {conclusions.map((conclusion) => (
          <ConclusionListItem
            key={conclusion.id}
            conclusion={conclusion}
            onClick={() => onSelectConclusion(conclusion)}
            isSelected={selectedConclusionId === conclusion.id}
          />
        ))}
      </ListContent>
    </ListContainer>
  );
}
