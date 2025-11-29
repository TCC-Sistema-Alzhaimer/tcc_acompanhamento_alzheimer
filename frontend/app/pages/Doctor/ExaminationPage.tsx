import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { ExamRequest } from "~/components/exam/ExamRequest";
import { PatientInfoCard } from "~/components/PatientDetail/PatientInfoCard";
import { ROUTES } from "~/routes/EnumRoutes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Solicitar Exames" },
    { name: "DoctorExamination", content: "Solicitação de exames" },
  ];
}

export default function DoctorExaminationPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
        onCreatePatient={() => navigate(ROUTES.DOCTOR.PATIENTS)}
      />

      <div className="h-full overflow-y-auto flex flex-col gap-6">
        {selectedPatientId === null ? (
          <div className="flex items-center justify-center h-full text-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <p>Selecione um paciente na lista para solicitar um exame.</p>
          </div>
        ) : (
          <>
            <PatientInfoCard patientId={selectedPatientId} />
            <ExamRequest
              patientId={selectedPatientId}
              doctorId={Number(loggedDoctorId) || 0}
            />
          </>
        )}
      </div>
    </main>
  );
}
