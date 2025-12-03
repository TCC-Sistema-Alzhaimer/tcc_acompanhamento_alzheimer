import { ChevronRight, Calendar, User, Stethoscope } from "lucide-react";
import type { ExamResponse } from "~/types/exam/examResponse";
import clsx from "clsx";

interface ExamListItemProps {
  exam: ExamResponse;
  isSelected: boolean;
  onClick: () => void;
}

function getStatusColor(statusId: string): string {
  switch (statusId?.toUpperCase()) {
    case "PENDING":
    case "PENDENTE":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "IN_PROGRESS":
    case "EM_ANDAMENTO":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "COMPLETED":
    case "CONCLUIDO":
      return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED":
    case "CANCELADO":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Não definida";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Data inválida";
  }
}

export function ExamListItem({ exam, isSelected, onClick }: ExamListItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
        isSelected
          ? "bg-teal-50 border-teal-300 ring-2 ring-teal-200"
          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900 truncate">
            {exam.examTypeDescription || "Exame"}
          </span>
          <span
            className={clsx(
              "px-2 py-0.5 text-xs font-medium rounded-full border",
              getStatusColor(exam.examStatusId)
            )}
          >
            {exam.examStatusDescription || exam.examStatusId}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <User size={14} className="text-teal-500" />
            {exam.patientName || "Paciente"}
          </span>
          <span className="flex items-center gap-1">
            <Stethoscope size={14} className="text-teal-500" />
            {exam.doctorName || "Médico"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} className="text-teal-500" />
            {formatDate(exam.requestDate)}
          </span>
        </div>

        {exam.instructions && (
          <p className="mt-1 text-sm text-gray-600 truncate">
            {exam.instructions}
          </p>
        )}
      </div>

      <ChevronRight
        size={20}
        className={clsx(
          "flex-shrink-0 transition-colors",
          isSelected ? "text-teal-500" : "text-gray-400"
        )}
      />
    </button>
  );
}
