import React, { useState } from "react";
import Button from "~/components/Button";
import { api } from "~/services/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";
import type { SelectChangeEvent } from "@mui/material";
import { useExamTypes } from "./hooks/useExamTypes";
import Form from "../form";
import { Send } from "lucide-react";
import { useToast } from "~/context/ToastContext";

interface SolicitarExameFormProps {
  patientId: number;
  doctorId: number;
}

export function ExamRequest({ patientId, doctorId }: SolicitarExameFormProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    tipo: "",
    dataFinal: "",
    anotacoes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { examTypes, isLoading: isLoadingTypes } = useExamTypes();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: String(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const examData = {
      patientId: patientId,
      doctorId: doctorId,
      examTypeId: formData.tipo,
      instructions: formData.anotacoes,
    };

    try {
      await api.post("/exams", examData);
      toast.success("Exame solicitado com sucesso!");
      setFormData({ tipo: "", dataFinal: "", anotacoes: "" });
    } catch (error) {
      console.error("Erro ao solicitar exame:", error);
      toast.error("Erro ao solicitar exame. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white border border-gray-200 rounded-lg p-4 shadow-sm gap-4"
    >
      <Form.Header title="Solicitar exames" />

      <Form.Select
        label="Tipo:"
        name="tipo"
        value={formData.tipo}
        onChange={handleSelectChange}
        options={examTypes.map((type) => ({
          value: type.id,
          label: type.description,
        }))}
        placeholder={
          isLoadingTypes ? "Carregando tipos..." : "Selecione o Tipo"
        }
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="dataFinal"
          className="text-sm font-semibold text-gray-700"
        >
          Data final:
        </label>
        <input
          type="date"
          id="dataFinal"
          name="dataFinal"
          value={formData.dataFinal}
          onChange={handleChange}
          className="p-2 border border-gray-300 bg-gray-50 rounded-lg w-full text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="anotacoes"
          className="text-sm font-semibold text-gray-700"
        >
          Anotações:
        </label>
        <textarea
          id="anotacoes"
          name="anotacoes"
          value={formData.anotacoes}
          onChange={handleChange}
          rows={3}
          placeholder="Anotações..."
          className="p-2 border border-gray-300 bg-gray-50 rounded-lg w-full text-sm"
        />
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
          {isSubmitting ? "Enviando..." : "Solicitar"}
        </Button>
      </div>
    </form>
  );
}
