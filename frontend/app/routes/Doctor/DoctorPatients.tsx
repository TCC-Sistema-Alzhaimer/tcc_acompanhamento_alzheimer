import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { QuickActions } from "~/components/UserList/QuickAction";
import { useAuth } from "~/hooks/useAuth";
import { PatientDetails } from "~/components/PatientDetail/PatientDetail";

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
  const { user } = useAuth();
  const loggedDoctorId = user?.id;

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
  };

  const handleCreatePatient = () => {
    console.log("Abrir modal de gerenciamento/criação de pacientes");
  };

  return (
    <main className="bg-white flex flex-row h-full">
      <div className="basis-1/4 h-full">
        <PatientList
          doctorId={Number(loggedDoctorId) || 0}
          onSelectPatient={handleSelectPatient}
          onCreatePatient={handleCreatePatient}
        />
      </div>

      <div className="flex-1 h-full overflow-y-auto bg-gray-100 p-6 flex flex-row gap-6">
        <div className="basis-7/12 h-full">
          <PatientDetails patientId={selectedPatientId} />
        </div>

        <div className="basis-5/12 h-full">
          <QuickActions patientId={selectedPatientId} />
        </div>
      </div>
    </main>
  );
}
