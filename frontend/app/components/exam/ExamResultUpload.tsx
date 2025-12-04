import React, { useState } from "react";
import { uploadExamResult } from "~/services/examService";
import { Button } from "~/components/ui/button";
import { Loader2, Upload } from "lucide-react";

interface Props {
  examId: number;
}

export function ExamResultUpload({ examId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage(null);

    try {
      await uploadExamResult(examId, file);
      setMessage("Exame enviado com sucesso!");
    } catch (e) {
      setMessage("Erro ao enviar o exame.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        Enviar Exame
      </h2>

      {/* Campo de arquivo */}
      <label className="block w-full">
        <span className="text-sm text-gray-600">Selecione o arquivo</span>
        <div
          className="
            mt-2
            flex items-center justify-center 
            w-full h-32
            rounded-xl border-2 border-dashed 
            border-blue-400 hover:border-blue-500 
            cursor-pointer transition
            bg-blue-50
          "
        >
          <input
            type="file"
            accept="application/pdf,image/*"
            className="hidden"
            id="exam-file-input"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label
            htmlFor="exam-file-input"
            className="text-blue-600 text-sm flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="w-6 h-6 opacity-80" />
            {file ? (
              <span className="font-medium text-xs text-blue-700">
                {file.name}
              </span>
            ) : (
              <span className="font-medium">Clique para escolher o arquivo</span>
            )}
          </label>
        </div>
      </label>

      {/* Botão */}
      <Button
        className="mt-5 w-full rounded-xl text-white font-medium"
        disabled={!file || loading}
        onClick={handleUpload}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Enviar Arquivo"
        )}
      </Button>

      {/* Mensagem */}
      {message && (
        <p
          className={`text-sm mt-3 ${
            message.includes("sucesso")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
