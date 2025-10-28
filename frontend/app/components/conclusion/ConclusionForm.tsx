import React, { useState } from "react";
import Button from "~/components/Button";
import { api } from "~/services/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";
import { UploadCloud } from "lucide-react";

interface ConclusionFormProps {
  patientId: number;
  doctorId: number;
}

export function ConclusionForm({ patientId, doctorId }: ConclusionFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: "",
    conclusao: "",
  });
  const [anexos, setAnexos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAnexos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const conclusionData = new FormData();
    conclusionData.append("patientId", String(patientId));
    conclusionData.append("doctorId", String(doctorId));
    conclusionData.append("title", formData.titulo);
    conclusionData.append("content", formData.conclusao);

    anexos.forEach((file) => {
      conclusionData.append("attachments", file);
    });

    try {
      await api.post("/conclusions", conclusionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Conclusão registrada com sucesso!");
      navigate(ROUTES.DOCTOR.PATIENTS);
    } catch (error) {
      console.error("Erro ao registrar conclusão:", error);
      alert("Erro ao registrar conclusão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5"
    >
      <h3 className="text-lg font-bold text-gray-800">Conclusão médica</h3>

      <p className="text-sm text-gray-600">
        Data de registro: {new Date().toLocaleDateString("pt-BR")} (Exemplo)
      </p>

      {/* Título */}
      <div className="flex flex-col gap-2">
        <label htmlFor="titulo" className="text-sm font-semibold text-gray-700">
          Título da conclusão:
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="flex-1 p-2 border border-gray-300 rounded-lg  bg-gray-100 w-full"
          placeholder="Título..."
        />
      </div>

      <div className="flex flex-col gap-2">
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
          rows={6}
          className="flex-1 p-2 border border-gray-300 bg-gray-100 rounded-lg w-full"
          placeholder="Conclusão..."
        />
      </div>

      {/* Anexos */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Anexos:</label>
        <div className="flex flex-wrap gap-2 items-center">
          {anexos.map((file) => (
            <div key={file.name} className="bg-gray-100 p-2 rounded-md text-sm">
              {file.name}
            </div>
          ))}

          <label
            htmlFor="file-upload"
            className="bg-gray-200 p-2 rounded-md cursor-pointer hover:bg-gray-300"
          >
            <UploadCloud size={20} />
            <input
              id="file-upload"
              name="anexos"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
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
          {isSubmitting ? "Registrando..." : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
