import React, { useState } from "react";
import { PatientDetails } from "~/components/PatientDetail/PatientDetail";
import { PatientList } from "~/components/UserList/PatientList";
import { QuickActions } from "~/components/UserList/QuickAction";

function PatientPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  const loggedDoctorId = 1;

  const handleSelectPatient = (id: number) => {
    console.log("Paciente selecionado na página principal:", id);
    setSelectedPatientId(id);
  };

  const handleCreatePatient = () => {
    console.log("Abrir modal de gerenciamento/criação de pacientes");
  };

  return (
    <main className="bg-gray-100 flex flex-col md:flex-row h-[calc(100vh-theme(spacing.16))]">
      <div className="md:basis-1/4 h-full">
        <PatientList
          doctorId={loggedDoctorId}
          onSelectPatient={handleSelectPatient}
          onCreatePatient={handleCreatePatient}
        />
      </div>

      <div className="md:basis-1/2 h-full overflow-y-auto p-6">
        <PatientDetails patientId={selectedPatientId} />
      </div>

      <div className="md:basis-1/4 h-full overflow-y-auto p-6">
        <QuickActions patientId={selectedPatientId} />
      </div>
    </main>
  );
}

export default PatientPage;
