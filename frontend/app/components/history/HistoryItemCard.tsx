import React from "react";
import { Clock, Paperclip, Download } from "lucide-react";
import type {
  FileInfo,
  MedicalHistoryResponse,
} from "~/types/exam/medicalHistoryResponse";

interface HistoryItemCardProps {
  item: MedicalHistoryResponse;
}

// Componente pequeno para exibir um anexo
const AttachmentItem = ({ file }: { file: FileInfo }) => (
  <a
    href={file.downloadLink}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-md text-sm text-gray-700 transition-colors"
  >
    <Paperclip size={14} />
    <span>{file.name}</span>
    <span className="text-xs text-gray-500">({file.formattedSize})</span>
    <Download size={14} className="ml-auto text-gray-400" />
  </a>
);

export function HistoryItemCard({ item }: HistoryItemCardProps) {
  const renderDot = () => {
    const bgColor = "bg-teal-500";
    return (
      <div
        className={`absolute left-[-29px] top-5 w-4 h-4 rounded-full ${bgColor} border-2 border-white`}
      ></div>
    );
  };

  return (
    <div className="flex gap-4 relative pl-4 border-l-2 border-gray-200 ml-2">
      {renderDot()}
      <div className="bg-white border border-gray-200 rounded-lg p-4 w-full flex flex-col gap-2">
        <p className="text-sm text-gray-800">{item.description}</p>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <Clock size={12} />
          <span>
            {new Date(item.createdAt).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
          {item.createdBy && <span>por Usuário #{item.createdBy}</span>}
        </div>

        {/* Anexos (se houver) */}
        {item.files && item.files.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-600">Anexos:</p>
            {item.files.map((file) => (
              <AttachmentItem key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
