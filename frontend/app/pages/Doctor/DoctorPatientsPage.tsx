import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { QuickActions } from "~/components/UserList/QuickAction";
import { useAuth } from "~/hooks/useAuth";
import { PatientDetails } from "~/components/PatientDetail/PatientDetail";
import { useNavigate, useSearchParams } from "react-router";
import { ROUTES } from "~/routes/EnumRoutes";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
  };

  const handleCreatePatient = () => {
    navigate(ROUTES.DOCTOR.PATIENTS);
  };

  const handleExamRequest = () => {
    if (!selectedPatientId) {
      alert("Por favor, selecione um paciente primeiro.");
      return;
    }
    navigate(ROUTES.DOCTOR.EXAMINATION, {
      state: { defaultPatientId: selectedPatientId },
    });
  };

  const handleRegisterConclusion = () => {
    if (!selectedPatientId) {
      alert("Por favor, selecione um paciente primeiro.");
      return;
    }

    navigate(ROUTES.DOCTOR.CONCLUSION, {
      state: { defaultPatientId: selectedPatientId },
    });
  };

  return (
    <main className="grid h-full gap-6 lg:grid-cols-[360px_1fr]">
      <PatientList
        doctorId={Number(loggedDoctorId) || 0}
        onSelectPatient={handleSelectPatient}
        onCreatePatient={handleCreatePatient}
        initialSearchTerm={initialSearch}
      />

      <div className="h-full overflow-y-auto flex flex-row gap-6">
        <div className="basis-7/12 h-full">
          <PatientDetails patientId={selectedPatientId} />
        </div>

        <div className="basis-5/12 h-full">
          <QuickActions
            patientId={selectedPatientId}
            onExamRequest={handleExamRequest}
            onRegisterConclusion={handleRegisterConclusion}
          />
        </div>
      </div>
    </main>
  );
}
