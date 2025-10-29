import React, { useState } from "react";
import Button from "~/components/Button";
import { api } from "~/services/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";
import type { SelectChangeEvent } from "@mui/material";
import { useExamTypes } from "./hooks/useExamTypes";
import Form from "../form";

interface SolicitarExameFormProps {
  patientId: number;
  doctorId: number;
}

export function ExamRequest({ patientId, doctorId }: SolicitarExameFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipo: "",
    categoria: "",
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
      alert("Exame solicitado com sucesso!");
      navigate(ROUTES.DOCTOR.PATIENTS);
    } catch (error) {
      console.error("Erro ao solicitar exame:", error);
      alert("Erro ao solicitar exame.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white gap-4 p-6 rounded-lg"
    >
      <Form.Header title="Solicitar exames" />

      <Form.Select
        label="Tipo"
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

      <Form.Select
        label="Categoria"
        name="categoria"
        value={formData.categoria}
        onChange={handleSelectChange}
        options={[]}
        placeholder="Selecione a Categoria"
      />

      <div className="flex flex-col gap-2">
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
          className="flex-1 p-2 border border-gray-300 bg-gray-100 rounded-lg w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
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
          rows={4}
          placeholder="Anotações..."
          className="flex-1 p-2 border border-gray-300 bg-gray-100 rounded-lg w-full"
        />
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(ROUTES.DOCTOR.PATIENTS)}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Solicitar"}
        </Button>
      </div>
    </form>
  );
}
