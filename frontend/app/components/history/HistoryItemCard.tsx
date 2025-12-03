import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Paperclip,
  Download,
  Stethoscope,
  FileText,
  ClipboardCheck,
  Activity,
  ChevronRight,
} from "lucide-react";
import type {
  MedicalHistoryResponseDTO,
  ExamResponseDTO,
  ConclusionResponseDTO,
  IndicatorResponseDTO,
  FileInfoDTO,
} from "~/services/doctorService";
import type { UnifiedHistoryItem } from "./hooks/usePatientHistory";
import { ROUTES } from "~/routes/EnumRoutes";

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

const ExamCard = ({
  item,
  onClick,
}: {
  item: ExamResponseDTO;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-lg p-4 w-full relative text-left hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
  >
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
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-700">
        Status: {item.examStatusDescription}
      </p>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  </button>
);

const ConclusionCard = ({
  item,
  onClick,
}: {
  item: ConclusionResponseDTO;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-lg p-4 w-full relative text-left hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
  >
    <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
      CONCLUSÃO
    </span>
    <p className="text-sm font-bold text-gray-800 mb-1">{item.title}</p>
    <p className="text-xs text-gray-800 mb-2">
      Dr. {item.doctorName} -{" "}
      {new Date(item.createdAt).toLocaleDateString("pt-BR")}
    </p>
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-700 truncate">{item.content}</p>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  </button>
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

interface HistoryItemCardProps {
  item: UnifiedHistoryItem;
  isLast?: boolean;
}

export function HistoryItemCard({
  item,
  isLast = false,
}: HistoryItemCardProps) {
  const navigate = useNavigate();

  const handleExamClick = () => {
    if (item.itemType === "EXAM") {
      navigate(
        `${ROUTES.DOCTOR.EXAMINATION}?examId=${item.id}&patientId=${item.patientId}`
      );
    }
  };

  const handleConclusionClick = () => {
    if (item.itemType === "CONCLUSION") {
      navigate(`${ROUTES.DOCTOR.CONCLUSION}?tab=list&conclusionId=${item.id}`, {
        state: {
          defaultPatientId: item.patientId,
        },
      });
    }
  };

  const getIconAndColor = () => {
    switch (item.itemType) {
      case "HISTORY":
        return {
          icon: <FileText size={14} className="text-yellow-600" />,
          bgColor: "bg-yellow-100",
        };
      case "EXAM":
        return {
          icon: <Stethoscope size={14} className="text-green-600" />,
          bgColor: "bg-green-100",
        };
      case "CONCLUSION":
        return {
          icon: <ClipboardCheck size={14} className="text-blue-600" />,
          bgColor: "bg-blue-100",
        };
      case "INDICATOR":
        return {
          icon: <Activity size={14} className="text-indigo-600" />,
          bgColor: "bg-indigo-100",
        };
      default:
        return { icon: null, bgColor: "bg-gray-100" };
    }
  };

  const { icon, bgColor } = getIconAndColor();

  return (
    <div className="relative pl-8">
      {/* Ponto na linha do tempo */}
      <div
        className={`absolute left-[-12px] top-4 w-6 h-6 rounded-full ${bgColor} border border-gray-300 flex items-center justify-center z-10`}
      >
        {icon}
      </div>

      {/* Card do item */}
      {item.itemType === "HISTORY" && <MedicalHistoryCard item={item} />}
      {item.itemType === "EXAM" && (
        <ExamCard item={item} onClick={handleExamClick} />
      )}
      {item.itemType === "CONCLUSION" && (
        <ConclusionCard item={item} onClick={handleConclusionClick} />
      )}
      {item.itemType === "INDICATOR" && <IndicatorCard item={item} />}
    </div>
  );
}
