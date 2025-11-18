import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState, useMemo } from "react"; // 1. Importe useMemo
import { useAuth } from "~/hooks/useAuth";
import { useLocation } from "react-router-dom";

import { usePatientDetails } from "~/components/PatientDetail/hooks/usePatientDetail";
import { usePatientIndicators } from "~/components/dashboard/hooks/usePatientsIndicators";
import { BioindicatorChart } from "~/components/dashboard/BioIndicatorChart";

// --- Card de Informações do Paciente ---
const PatientInfoCard = ({ patientId }: { patientId: number | null }) => {
  const { patient, isLoading } = usePatientDetails(patientId);

  const calculateAge = (birthdate: Date | string) => {
    try {
      const birth = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age;
    } catch (error) {
      return "?";
    }
  };

  if (isLoading || !patient) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        {/* Placeholder UI */}
      </div>
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
    { title: "Dashboard" },
    { name: "DoctorDashboard", content: "Dashboard do paciente" },
  ];
}

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  const loggedDoctorId = user?.id;

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () => location.state?.defaultPatientId || null
  );

  const { indicators, isLoading } = usePatientIndicators(selectedPatientId);

  const chartData = useMemo(() => {
    const bio1 = indicators.filter((i) => i.tipoId === 1);
    const bio2 = indicators.filter((i) => i.tipoId === 2);
    const bio3 = indicators.filter((i) => i.tipoId === 3);
    const bio4 = indicators.filter((i) => i.tipoId === 4);

    return { bio1, bio2, bio3, bio4 };
  }, [indicators]);

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
  };

  return (
    <main className="bg-white flex flex-row h-full">
      {/* Coluna 1 (Igual) */}
      <div className="basis-1/4 h-full">
        <PatientList
          doctorId={Number(loggedDoctorId) || 0}
          onSelectPatient={handleSelectPatient}
          onCreatePatient={() => {}}
        />
      </div>

      <div className="flex-1 h-full overflow-y-auto bg-gray-100 p-6 flex flex-col gap-6">
        {selectedPatientId === null ? (
          <div className="flex items-center justify-center h-full text-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <p>Selecione um paciente na lista para ver o dashboard.</p>
          </div>
        ) : (
          <>
            <PatientInfoCard patientId={selectedPatientId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BioindicatorChart
                title="Bioindicador 1"
                data={chartData.bio1}
                isLoading={isLoading}
              />
              <BioindicatorChart
                title="Bioindicador 2"
                data={chartData.bio2}
                isLoading={isLoading}
              />
              <BioindicatorChart
                title="Bioindicador 3"
                data={chartData.bio3}
                isLoading={isLoading}
              />
              <BioindicatorChart
                title="Bioindicador 4"
                data={chartData.bio4}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
