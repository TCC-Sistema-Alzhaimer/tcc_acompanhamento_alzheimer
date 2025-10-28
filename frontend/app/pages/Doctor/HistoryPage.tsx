import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { usePatientDetails } from "~/components/PatientDetail/hooks/usePatientDetail";

const PatientInfoCard = ({ patientId }: { patientId: number | null }) => {
  const { patient, isLoading } = usePatientDetails(patientId);
  const calculateAge = (birthdate: Date | string) => {
    /*...*/
  };
  if (isLoading || !patient) return <div className="animate-pulse">...</div>;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Histórico do Paciente" },
    { name: "DoctorHistory", content: "Histórico completo do paciente" },
  ];
}

export default function DoctorHistoryPage() {
  const { user } = useAuth();
  const location = useLocation();
  const initialPatientId = location.state?.defaultPatientId || null;
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    initialPatientId
  );

  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const { history, isLoading } = usePatientHistory(selectedPatientId, {
    filterType: filterType || undefined,
  });

  return (
    <main className="bg-gray-100 h-full p-6 flex flex-col gap-6">
      <PatientInfoCard patientId={selectedPatientId} />

      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">
          Filtrar por:
        </span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Tipo</option>
          <option value="CONSULTATION">Consulta</option>
          <option value="EXAM">Exame</option>
          <option value="NOTE">Anotação</option>
        </select>
      </div>

      <div className="flex flex-col gap-6">
        {isLoading && <p className="text-gray-500">Carregando histórico...</p>}

        {!isLoading && history.length === 0 && (
          <p className="text-gray-500 text-center py-10">
            Nenhum histórico encontrado para este paciente.
          </p>
        )}

        {!isLoading &&
          history.map((item) => <HistoryItemCard key={item.id} item={item} />)}
      </div>
    </main>
  );
}
