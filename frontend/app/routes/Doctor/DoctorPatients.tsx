import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { PatientDetails } from "~/components/PatientDetail/PatientDetail";
import { QuickActions } from "~/components/UserList/QuickAction";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pacientes" },
    { name: "DoctorPatients", content: "Visão geral dos pacientes" },
  ];
}

export default function DoctorPatientsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const loggedDoctorId = 1;

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
  };

  const handleCreatePatient = () => {
    console.log("Abrir modal de gerenciamento/criação de pacientes");
  };

  return (
    <main className="bg-white flex flex-row h-full">
      {/* Coluna 1: Lista de Pacientes */}
      <div className="basis-1/4 h-full">
        {/* PatientList DEVE ter h-full internamente */}
        <PatientList
          doctorId={loggedDoctorId}
          onSelectPatient={handleSelectPatient}
          onCreatePatient={handleCreatePatient}
        />
      </div>

      {/* Container para as colunas 2 e 3 (Área Cinza) */}
      {/* MUDANÇA: Este agora é o flex container */}
      <div className="flex-1 h-full overflow-y-auto bg-gray-100 p-6 flex flex-row gap-6">
        {/* Coluna 2: Detalhes do Paciente */}
        {/* Adicionamos h-full aqui */}
        <div className="basis-7/12 h-full">
          {/* PatientDetails DEVE ter h-full internamente */}
          <PatientDetails patientId={selectedPatientId} />
        </div>

        {/* Coluna 3: Ações Rápidas */}
        {/* Adicionamos h-full aqui */}
        <div className="basis-5/12 h-full">
          {/* QuickActions DEVE ter h-full internamente */}
          <QuickActions patientId={selectedPatientId} />
        </div>
      </div>
    </main>
  );
}
