import { ExamStatus as ExamStatusEnum } from "@/types/enum/exam-status";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface ExamStatusProps {
  status: string | undefined;
}

/*
    REQUESTED("Solicitado"),
    SCHEDULED("Agendado"),
    IN_PROGRESS("Em Andamento"),
    COMPLETED("Concluído"),
    CANCELLED("Cancelado"),
    PENDING_RESULT("Aguardando Resultado");
*/

const statusColors: Record<string, string> = {
  [ExamStatusEnum.REQUESTED]: "#FFA500", // Orange
  [ExamStatusEnum.SCHEDULED]: "#1E90FF", // Dodger Blue
  [ExamStatusEnum.IN_PROGRESS]: "#FFFF00", // Yellow
  [ExamStatusEnum.COMPLETED]: "#32CD32", // Lime Green
  [ExamStatusEnum.CANCELLED]: "#FF4500", // Orange Red
  [ExamStatusEnum.PEDDING_RESULT]: "#800080", // Purple
};

export function ExamStatus({ status }: ExamStatusProps) {
  if (!status) {
    return null;
  }

  return (
    <ThemedView
      style={{
        padding: 8,
        borderRadius: 4,
        alignSelf: "flex-start",
        backgroundColor: statusColors[status],
      }}
    >
      <ThemedText type="primary">{status}</ThemedText>
    </ThemedView>
  );
}
