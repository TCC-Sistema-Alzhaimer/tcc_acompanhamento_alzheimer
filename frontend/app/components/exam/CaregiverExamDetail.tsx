import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, FileText, Calendar, User, Stethoscope, Clock, ClipboardList, Paperclip, Download, FileImage, File, MessageSquare, ExternalLink } from "lucide-react";
import type { ExamResponse } from "~/types/exam/examResponse";
import type { ExamResultResponse } from "~/types/exam/examResultResponse";
import type { ConclusionResponse } from "~/types/exam/conclusionResponse";
import { getExamById, getExamResults, getExamConclusions } from "~/services/examService";
import clsx from "clsx";

interface CaregiverExamDetailProps {
  examId: number;
  onBack?: () => void;
}

function getStatusColor(statusId: string): string {
  switch (statusId?.toUpperCase()) {
    case "REQUESTED": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "SCHEDULED": return "bg-purple-100 text-purple-800 border-purple-200";
    case "IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
    case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
    case "PENDING_RESULT": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
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

export function CaregiverExamDetail({ examId, onBack }: CaregiverExamDetailProps) {
  const [exam, setExam] = useState<ExamResponse | null>(null);
  const [results, setResults] = useState<ExamResultResponse[]>([]);
  const [conclusions, setConclusions] = useState<ConclusionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [isLoadingConclusions, setIsLoadingConclusions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExam() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getExamById(examId);
        setExam(response.data);
      } catch (err) {
        console.error("Erro ao buscar exame:", err);
        setError("Erro ao carregar detalhes do exame");
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchResults() {
      setIsLoadingResults(true);
      try {
        const response = await getExamResults(examId);
        setResults(response.data);
      } catch (err) {
        console.error("Erro ao buscar resultados:", err);
      } finally {
        setIsLoadingResults(false);
      }
    }

    async function fetchConclusions() {
      setIsLoadingConclusions(true);
      try {
        const response = await getExamConclusions(examId);
        setConclusions(response.data);
      } catch (err) {
        console.error("Erro ao buscar conclusões:", err);
      } finally {
        setIsLoadingConclusions(false);
      }
    }

    fetchExam();
    fetchResults();
    fetchConclusions();
  }, [examId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
        <span className="ml-2 text-gray-600">Carregando exame...</span>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-red-500">{error || "Exame não encontrado"}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 flex items-center gap-2 text-teal-600 hover:text-teal-700"
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
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para lista
          </button>
        </div>
      )}

      <div className="p-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {exam.examTypeDescription || "Exame"}
            </h2>
            <p className="text-sm text-gray-600">Exame #{exam.id}</p>
          </div>

          <span
            className={clsx(
              "px-3 py-1 text-sm font-medium rounded-full border",
              getStatusColor(exam.examStatusId)
            )}
          >
            {exam.examStatusDescription || exam.examStatusId}
          </span>
        </div>

        {/* Dados do Exame */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-teal-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Paciente</p>
                <p className="font-medium text-gray-900">
                  {exam.patientName || "Não informado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Stethoscope className="w-5 h-5 text-teal-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Médico Solicitante
                </p>
                <p className="font-medium text-gray-900">
                  {exam.doctorName || "Não informado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-teal-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tipo de Exame
                </p>
                <p className="font-medium text-gray-900">
                  {exam.examTypeDescription || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-teal-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Data da Solicitação
                </p>
                <p className="font-medium text-gray-900">
                  {formatDateTime(exam.requestDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-teal-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Última Atualização
                </p>
                <p className="font-medium text-gray-900">
                  {formatDateTime(exam.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instruções */}
        {exam.instructions && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <ClipboardList className="w-5 h-5 text-teal-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Instruções / Observações
                </p>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {exam.instructions}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Documentos */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Paperclip className="w-5 h-5 text-teal-500" />
            <p className="text-sm font-medium text-gray-800">
              Documentos do Exame ({results.length})
            </p>
          </div>

          {isLoadingResults ? (
            <div className="flex items-center gap-2 text-gray-600 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Carregando documentos...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                Nenhum documento anexado a este exame.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((result) => (
                <a
                  key={result.id}
                  href={result.downloadLink}
                  download={result.fileName}
                  className="flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  {result.isImage ? (
                    <FileImage className="w-5 h-5 text-teal-500" />
                  ) : result.isPdf ? (
                    <FileText className="w-5 h-5 text-red-500" />
                  ) : (
                    <File className="w-5 h-5 text-gray-600" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {result.fileName}
                    </p>
                    <p className="text-xs text-gray-700">
                      {result.formattedFileSize} •{" "}
                      {new Date(result.uploadDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <Download className="w-5 h-5 text-teal-500 group-hover:text-teal-600 transition-colors" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Conclusões */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-teal-500" />
            <p className="text-sm font-medium text-gray-800">
              Conclusões Médicas ({conclusions.length})
            </p>
          </div>

          {isLoadingConclusions ? (
            <div className="flex items-center gap-2 text-gray-600 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Carregando conclusões...</span>
            </div>
          ) : conclusions.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                Nenhuma conclusão registrada para este exame.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {conclusions.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-800">
                      {c.description}
                    </h4>
                    <span className="text-xs text-gray-600">
                      {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {c.conclusion}
                  </p>

                  {c.notes && (
                    <p className="mt-2 text-xs text-gray-600 italic">
                      Obs: {c.notes}
                    </p>
                  )}

                  {c.files?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Anexos:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {c.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 bg-white px-2 py-1 rounded border border-gray-200"
                          >
                            <Download className="w-3 h-3" />
                            {file.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
