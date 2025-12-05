import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { PatientInfoCard } from "~/components/PatientDetail/PatientInfoCard";
import { IndicatorForm } from "~/components/dashboard/IndicatorForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adicionar Indicador" },
    { name: "DoctorAddIndicator", content: "Adicionar novo indicador" },
  ];
}

export default function DoctorAddIndicatorPage() {
  const { user } = useAuth();
  const location = useLocation();
  const loggedDoctorId = user?.id;

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () => location.state?.defaultPatientId || null
  );

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
  };

  return (
    <main className="grid h-full gap-6 lg:grid-cols-[360px_1fr]">
      <PatientList
        doctorId={Number(loggedDoctorId) || 0}
        onSelectPatient={handleSelectPatient}
        onCreatePatient={() => {}}
      />

      <div className="h-full overflow-y-auto flex flex-col gap-6 p-6">
        {selectedPatientId === null ? (
          <div className="flex items-center justify-center h-full text-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <p>Selecione um paciente para adicionar um indicador.</p>
          </div>
        ) : (
          <>
            <PatientInfoCard patientId={selectedPatientId} />

            {/* Renderiza o formulário */}
            <IndicatorForm patientId={selectedPatientId} />
          </>
        )}
      </div>
    </main>
  );
}
