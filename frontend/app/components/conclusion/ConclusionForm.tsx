import React, { useState } from "react";
import Button from "~/components/Button";
import { api } from "~/services/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";
import { UploadCloud, Send } from "lucide-react";
import type { SelectChangeEvent } from "@mui/material";
import { usePatientExams } from "../exam/hooks/usePatientExams";
import Form from "../form";
import type { ConclusionCreate } from "~/types/exam/conclusionCreate";
import { useToast } from "~/context/ToastContext";

interface ConclusionFormProps {
  patientId: number;
  doctorId: number;
}

export function ConclusionForm({ patientId, doctorId }: ConclusionFormProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    titulo: "",
    conclusao: "",
    examId: "",
  });
  const [anexos, setAnexos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { exams, isLoading: isLoadingExams } = usePatientExams(patientId);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: String(value) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAnexos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const conclusionCreate: ConclusionCreate = {
      patientId: patientId,
      doctorId: doctorId,
      examId: Number(formData.examId),
      description: formData.titulo,
      conclusion: formData.conclusao,
    };

    const conclusionData = new FormData();
    conclusionData.append(
      "data",
      new Blob([JSON.stringify(conclusionCreate)], {
        type: "application/json",
      })
    );

    anexos.forEach((file) => {
      conclusionData.append("files", file);
    });

    try {
      await api.post("/conclusions", conclusionData);
      toast.success("Conclusão registrada com sucesso!");
      setFormData({ titulo: "", conclusao: "", examId: "" });
      setAnexos([]);
    } catch (error) {
      console.error("Erro ao registrar conclusão:", error);
      toast.error("Erro ao registrar conclusão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white border border-gray-200 rounded-lg p-4 shadow-sm gap-4"
    >
      <Form.Header title="Conclusão médica" />

      <p className="text-sm text-gray-600">
        Data de registro: {new Date().toLocaleDateString("pt-BR")}
      </p>

      <Form.Select
        label="Exame Relacionado:"
        name="examId"
        value={formData.examId}
        onChange={handleSelectChange}
        options={exams.map((exam) => ({
          value: exam.id,
          label: `${exam.examTypeDescription} (${new Date(
            exam.requestDate
          ).toLocaleDateString("pt-BR")})`,
        }))}
        placeholder={
          isLoadingExams ? "Carregando exames..." : "Selecione um exame"
        }
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="titulo" className="text-sm font-semibold text-gray-700">
          Título da conclusão:
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="p-2 border border-gray-300 bg-gray-50 rounded-lg w-full text-sm"
          placeholder="Título..."
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="conclusao"
          className="text-sm font-semibold text-gray-700"
        >
          Conclusão médica:
        </label>
        <textarea
          id="conclusao"
          name="conclusao"
          value={formData.conclusao}
          onChange={handleChange}
          rows={4}
          className="p-2 border border-gray-300 bg-gray-50 rounded-lg w-full text-sm"
          placeholder="Conclusão..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Anexos:</label>
        <div className="flex flex-wrap gap-2 items-center">
          {anexos.map((file) => (
            <div
              key={file.name}
              className="bg-gray-50 border border-gray-300 p-2 rounded-lg text-sm"
            >
              {file.name}
            </div>
          ))}

          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 bg-gray-50 border border-gray-300 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors text-sm text-gray-600"
          >
            <UploadCloud size={18} />
            <span>Anexar arquivo</span>
            <input
              id="file-upload"
              name="anexos"
              type="file"
              multiple
              accept=".pdf,.jpeg,.jpg,.png,.gif,image/jpeg,image/png,image/gif,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <span className="text-xs text-gray-600">
          Formatos aceitos: PDF, JPEG, JPG, PNG, GIF
        </span>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <Button
          type="button"
          variant="secondary"
          className="!w-auto !py-2 !px-4 text-sm"
          onClick={() => navigate(ROUTES.DOCTOR.PATIENTS)}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="!w-auto !py-2 !px-4 text-sm"
          disabled={isSubmitting}
        >
          <Send size={16} className="mr-2" />
          {isSubmitting ? "Registrando..." : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
