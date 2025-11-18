import React from "react";
import {
  Clock,
  Paperclip,
  Download,
  Stethoscope,
  FileText,
  ClipboardCheck,
  Activity,
} from "lucide-react";
import type {
  MedicalHistoryResponseDTO,
  ExamResponseDTO,
  ConclusionResponseDTO,
  IndicatorResponseDTO,
  FileInfoDTO,
} from "~/services/doctorService";
import type { UnifiedHistoryItem } from "./hooks/usePatientHistory";

const AttachmentItem = ({ file }: { file: FileInfoDTO }) => (
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

const MedicalHistoryCard = ({ item }: { item: MedicalHistoryResponseDTO }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 w-full flex flex-col gap-2 relative">
    <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded">
      ANOTAÇÃO
    </span>
    <p className="text-sm text-gray-800">{item.description}</p>
    <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
      <Clock size={12} />
      <span>
        {new Date(item.createdAt).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </span>
      {item.createdBy && <span>por Usuário #{item.createdBy}</span>}
    </div>
    {item.files && item.files.length > 0 && (
      <div className="mt-3 flex flex-col gap-2">
        <p className="text-xs font-semibold text-gray-600">Anexos:</p>
        {item.files.map((file) => (
          <AttachmentItem key={file.id} file={file} />
        ))}
      </div>
    )}
  </div>
);

const ExamCard = ({ item }: { item: ExamResponseDTO }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 w-full relative">
    <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
      EXAME
    </span>
    <p className="text-sm font-bold text-gray-800 mb-1">
      Exame: {item.examTypeDescription}
    </p>
    <p className="text-xs text-gray-800 mb-2">
      Solicitado por {item.doctorName} -{" "}
      {new Date(item.requestDate).toLocaleDateString("pt-BR")}
    </p>
    <p className="text-sm text-gray-700">
      Status: {item.examStatusDescription}
    </p>
  </div>
);

const ConclusionCard = ({ item }: { item: ConclusionResponseDTO }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 w-full relative">
    <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
      CONSULTA
    </span>
    <p className="text-sm font-bold text-gray-800 mb-1">{item.title}</p>
    <p className="text-xs text-gray-800 mb-2">
      Dr. {item.doctorName} -{" "}
      {new Date(item.createdAt).toLocaleDateString("pt-BR")}
    </p>
    <p className="text-sm text-gray-700 truncate">{item.content}</p>
  </div>
);

const IndicatorCard = ({ item }: { item: IndicatorResponseDTO }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 w-full relative">
    <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
      INDICADOR
    </span>
    <p className="text-sm font-bold text-gray-800 mb-1">
      {item.tipoDescription}
    </p>
    <p className="text-xs text-gray-800 mb-2">
      Data: {new Date(item.data).toLocaleDateString("pt-BR")}
    </p>
    <p className="text-sm text-gray-800">Valor: {item.valor}</p>
    {item.descricao && (
      <p className="text-sm text-gray-700 mt-1">Obs: {item.descricao}</p>
    )}
  </div>
);

export function HistoryItemCard({ item }: { item: UnifiedHistoryItem }) {
  const renderDot = () => {
    let bgColor = "bg-gray-300";

    if (item.itemType === "HISTORY") {
      bgColor = "bg-yellow-500";
    }
    if (item.itemType === "EXAM") {
      bgColor = "bg-green-500";
    }
    if (item.itemType === "CONCLUSION") {
      bgColor = "bg-blue-500";
    }
    if (item.itemType === "INDICATOR") {
      bgColor = "bg-indigo-500";
    }

    return (
      <div
        className={`absolute left-[-29px] top-5 w-4 h-4 rounded-full ${bgColor} border-2 border-white flex items-center justify-center`}
      ></div>
    );
  };

  return (
    <div className="flex gap-4 relative pl-4 border-l-3 border-white ml-2">
      {renderDot()}
      {item.itemType === "HISTORY" && <MedicalHistoryCard item={item} />}
      {item.itemType === "EXAM" && <ExamCard item={item} />}
      {item.itemType === "CONCLUSION" && <ConclusionCard item={item} />}
      {item.itemType === "INDICATOR" && <IndicatorCard item={item} />}
    </div>
  );
}
