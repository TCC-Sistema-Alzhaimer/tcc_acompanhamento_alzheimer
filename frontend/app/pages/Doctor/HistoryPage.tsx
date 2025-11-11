import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation } from "react-router-dom";
import Button from "~/components/Button";
import { usePatientDetails } from "~/components/PatientDetail/hooks/usePatientDetail";
import { usePatientHistory } from "~/components/history/hooks/usePatientHistory";
import { HistoryItemCard } from "~/components/history/HistoryItemCard";

// --- Card de Informações do Paciente ---
const PatientInfoCard = ({ patientId }: { patientId: number | null }) => {
  const { patient, isLoading } = usePatientDetails(patientId);
  const calculateAge = (birthdate: Date | string) => {
    try {
      const birth = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      return "?";
    }
  };

  if (isLoading || !patient) {
    return (
      <div className="animate-pulse bg-white p-6 rounded-lg shadow">...</div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Dados do Paciente: {patient.name}
      </h3>
      <div className="bg-gray-100 rounded-lg p-5">
        <strong className="block text-base font-bold text-gray-800 mb-2">
          {patient.name} • {calculateAge(patient.birthdate)} anos •{" "}
          {patient.gender}
        </strong>
        <p className="text-sm text-gray-600">
          Data de Nascimento:{" "}
          {new Date(patient.birthdate).toLocaleDateString("pt-BR")} • ID: #
          {patient.id}
        </p>
      </div>
    </div>
  );
};
// --- Fim do Card ---

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Histórico Médico" },
    { name: "DoctorHistory", content: "Histórico médico do paciente" },
  ];
}

export default function DoctorHistoryPage() {
  const { user } = useAuth();
  const location = useLocation();
  const initialPatientId = location.state?.defaultPatientId || null;
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    initialPatientId
  );

  const { history, isLoading } = usePatientHistory(selectedPatientId);

  return (
    <main className="bg-gray-100 h-full p-6 flex flex-col gap-6">
      <PatientInfoCard patientId={selectedPatientId} />

      <div className="flex flex-col gap-6">
        {isLoading && <p className="text-gray-500">Carregando histórico...</p>}

        {!isLoading && history.length === 0 && (
          <p className="text-gray-800 text-center py-10">
            Nenhum histórico encontrado para este paciente.
          </p>
        )}

        {!isLoading &&
          history.map((item) => <HistoryItemCard key={item.id} item={item} />)}
      </div>
    </main>
  );
}
