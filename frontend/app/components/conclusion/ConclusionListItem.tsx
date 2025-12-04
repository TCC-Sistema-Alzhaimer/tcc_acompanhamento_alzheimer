import {
  MessageSquare,
  Calendar,
  ChevronRight,
  Paperclip,
  Stethoscope,
} from "lucide-react";
import type { ConclusionResponseDTO } from "~/services/doctorService";
import clsx from "clsx";

interface ConclusionListItemProps {
  conclusion: ConclusionResponseDTO;
  onClick: () => void;
  isSelected?: boolean;
}

export function ConclusionListItem({
  conclusion,
  onClick,
  isSelected,
}: ConclusionListItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left p-4 rounded-lg border transition-all cursor-pointer",
        isSelected
          ? "bg-teal-50 border-teal-300 ring-2 ring-teal-200"
          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          {/* Título */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 truncate">
              {conclusion.title}
            </span>
          </div>

          {/* Informações: Data, Médico, Anexos */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-teal-500" />
              {new Date(conclusion.createdAt).toLocaleDateString("pt-BR")}
            </span>

            {conclusion.doctorName && (
              <span className="flex items-center gap-1">
                <Stethoscope size={14} className="text-teal-500" />
                Dr. {conclusion.doctorName}
              </span>
            )}

            {conclusion.attachmentUrls &&
              conclusion.attachmentUrls.length > 0 && (
                <span className="flex items-center gap-1">
                  <Paperclip size={14} className="text-teal-500" />
                  {conclusion.attachmentUrls.length} anexo
                  {conclusion.attachmentUrls.length !== 1 ? "s" : ""}
                </span>
              )}
          </div>

          {/* Descrição/Conteúdo */}
          {conclusion.content && (
            <p className="text-sm text-gray-600 truncate">
              {conclusion.content}
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
      </div>
    </button>
  );
}
