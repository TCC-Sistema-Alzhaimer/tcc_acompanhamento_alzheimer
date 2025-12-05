import React, { useState } from "react";
import Button from "~/components/Button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";
import { createIndicator } from "~/services/doctorService";
import type { SelectChangeEvent } from "@mui/material";
import Form from "../form";

interface IndicatorFormProps {
  patientId: number;
}

const INDICATOR_TYPES = [
  { value: "1", label: "Nível de Atividade Física" },
  { value: "2", label: "Qualidade do Sono" },
  { value: "3", label: "Nível de Agitação" },
  { value: "4", label: "Cognição / Estado Mental" },
];

export function IndicatorForm({ patientId }: IndicatorFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tipoId: "",
    valor: "",
    data: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().split(" ")[0].slice(0, 5),
    descricao: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "valor") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        return;
      }

      const numValue = parseInt(value, 10);

      if (isNaN(numValue)) return;

      let finalValue = numValue;
      if (numValue < 0) finalValue = 0;
      if (numValue > 100) finalValue = 100;

      setFormData((prev) => ({ ...prev, [name]: String(finalValue) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: String(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tipoId || !formData.valor) {
      alert("Preencha o tipo e o valor.");
      return;
    }

    setIsSubmitting(true);

    try {
      const dateTime = `${formData.data}T${formData.hora}:00`;

      await createIndicator({
        patientId,
        tipoId: Number(formData.tipoId),
        valor: Number(formData.valor),
        descricao: formData.descricao,
        data: dateTime,
      });

      alert("Indicador registrado com sucesso!");
      navigate(ROUTES.DOCTOR.DASHBOARD, {
        state: { defaultPatientId: patientId },
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar indicador.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5"
    >
      <h3 className="text-lg font-bold text-gray-800">Novo Indicador</h3>

      <Form.Select
        label="Tipo de Indicador"
        name="tipoId"
        value={formData.tipoId}
        onChange={handleSelectChange}
        options={INDICATOR_TYPES}
        placeholder="Selecione o Bioindicador"
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">
          Valor (0-100):
        </label>
        <input
          type="number"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          placeholder="Ex: 80"
          min="0"
          max="100"
          className="flex-1 p-2 border border-gray-300 rounded-lg w-full"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-gray-700">Data:</label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-gray-700">Hora:</label>
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">
          Observação:
        </label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={3}
          placeholder="Alguma observação sobre a medição..."
          className="flex-1 p-2 border border-gray-300 rounded-lg w-full"
        />
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            navigate(ROUTES.DOCTOR.DASHBOARD, {
              state: { defaultPatientId: patientId },
            })
          }
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Indicador"}
        </Button>
      </div>
    </form>
  );
}
