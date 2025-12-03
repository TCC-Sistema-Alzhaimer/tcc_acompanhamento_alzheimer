import { useState, useEffect } from "react";
import {
  MessageSquare,
  Calendar,
  User,
  FileText,
  Loader2,
  ArrowLeft,
  Paperclip,
  Download,
  FileImage,
  File,
  ClipboardList,
  ExternalLink,
} from "lucide-react";
import type { ConclusionResponseDTO } from "~/services/doctorService";
import { api } from "~/services/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";

interface ConclusionDetailProps {
  conclusionId: number;
  onBack?: () => void;
}

function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "Não definida";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Data inválida";
  }
}

export function ConclusionDetail({
  conclusionId,
  onBack,
}: ConclusionDetailProps) {
  const navigate = useNavigate();
  const [conclusion, setConclusion] = useState<ConclusionResponseDTO | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleViewExam = () => {
    if (conclusion?.examId) {
      navigate(`${ROUTES.DOCTOR.EXAMINATION}?examId=${conclusion.examId}`);
    }
  };

  useEffect(() => {
    async function fetchConclusion() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<ConclusionResponseDTO>(
          `/conclusions/${conclusionId}`
        );
        setConclusion(response.data);
      } catch (err) {
        console.error("Erro ao buscar conclusão:", err);
        setError("Erro ao carregar detalhes da conclusão");
      } finally {
        setIsLoading(false);
      }
    }
    fetchConclusion();
  }, [conclusionId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
        <span className="ml-2 text-gray-600">Carregando conclusão...</span>
      </div>
    );
  }

  if (error || !conclusion) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-red-500">{error || "Conclusão não encontrada"}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 flex items-center gap-2 text-teal-600 hover:text-teal-700 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {onBack && (
        <div className="px-6 py-3 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Voltar para lista
          </button>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {conclusion.title}
            </h2>
            <p className="text-sm text-gray-600">Conclusão #{conclusion.id}</p>
          </div>
          <div className="flex items-center gap-2">
            {conclusion.examId && (
              <button
                onClick={handleViewExam}
                className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
              >
                <ExternalLink size={14} />
                Ver Exame
              </button>
            )}
            <span className="px-3 py-1 text-sm font-medium rounded-full border bg-blue-100 text-blue-800 border-blue-200">
              Conclusão Médica
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-teal-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Data de Criação
                </p>
                <p className="font-medium text-gray-900">
                  {formatDateTime(conclusion.createdAt)}
                </p>
              </div>
            </div>

            {conclusion.doctorName && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-teal-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Médico Responsável
                  </p>
                  <p className="font-medium text-gray-900">
                    Dr. {conclusion.doctorName}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {conclusion.patientName && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-teal-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Paciente</p>
                  <p className="font-medium text-gray-900">
                    {conclusion.patientName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo da Conclusão */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-teal-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Conclusão Médica
              </p>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {conclusion.content}
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Anexos - usa files se disponível, senão attachmentUrls */}
        {((conclusion.files && conclusion.files.length > 0) ||
          (conclusion.attachmentUrls &&
            conclusion.attachmentUrls.length > 0)) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Paperclip className="w-5 h-5 text-teal-500" />
              <p className="text-sm font-medium text-gray-800">
                Anexos da Conclusão (
                {conclusion.files?.length ||
                  conclusion.attachmentUrls?.length ||
                  0}
                )
              </p>
            </div>

            <div className="space-y-2">
              {conclusion.files && conclusion.files.length > 0
                ? // Usa files com informações detalhadas
                  conclusion.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        {file.isImage ? (
                          <FileImage className="w-5 h-5 text-teal-500" />
                        ) : file.isPdf ? (
                          <FileText className="w-5 h-5 text-red-500" />
                        ) : (
                          <File className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-700">
                          {file.formattedSize} • {file.fileType}
                        </p>
                      </div>
                      <Download className="w-5 h-5 text-teal-500 group-hover:text-teal-600 transition-colors" />
                    </a>
                  ))
                : // Fallback para attachmentUrls
                  conclusion.attachmentUrls?.map((url, index) => {
                    const isPdf = url.toLowerCase().includes(".pdf");
                    const isImage = /\.(jpg|jpeg|png|gif|webp)/i.test(url);
                    const fileName =
                      url.split("/").pop() || `Anexo ${index + 1}`;

                    return (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <div className="flex-shrink-0">
                          {isImage ? (
                            <FileImage className="w-5 h-5 text-teal-500" />
                          ) : isPdf ? (
                            <FileText className="w-5 h-5 text-red-500" />
                          ) : (
                            <File className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {fileName}
                          </p>
                          <p className="text-xs text-gray-700">
                            {isPdf ? "PDF" : isImage ? "Imagem" : "Documento"}
                          </p>
                        </div>
                        <Download className="w-5 h-5 text-teal-500 group-hover:text-teal-600 transition-colors" />
                      </a>
                    );
                  })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
