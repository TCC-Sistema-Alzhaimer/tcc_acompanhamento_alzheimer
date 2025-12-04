import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ExamList } from "~/components/exam/ExamList";

// 🔥 AGORA IMPORTA O NOVO COMPONENTE
import { CaregiverExamDetail } from "~/components/exam/CaregiverExamDetail";

import { ROUTES } from "~/routes/EnumRoutes";
import { ContentPlaceholder } from "~/components/ui";
import type { ExamResponse } from "~/types/exam/examResponse";
import { ExamResultUpload } from "~/components/exam/ExamResultUpload";
import { CaregiverPatientList } from "~/components/UserList/CaregiverPatientList";

// (se você tiver um PatientInfoCard do cuidador, mantenha aqui, se não, remova)
import { PatientInfoCard } from "~/components/PatientDetail/PatientInfoCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exames (Cuidador)" },
    { name: "CaregiverExamination", content: "Gerenciamento de exames" },
  ];
}

export default function CaregiverExaminationPage() {
  const { user } = useAuth();
  const caregiverId = user?.id;

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const examIdFromUrl = searchParams.get("examId");
  const patientIdFromUrl = searchParams.get("patientId");

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () =>
      location.state?.defaultPatientId ||
      (patientIdFromUrl ? Number(patientIdFromUrl) : null)
  );

  const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);

  useEffect(() => {
    if (examIdFromUrl) {
      setSelectedExam(null);
    }
  }, [examIdFromUrl]);

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
    setSelectedExam(null);
    setSearchParams({});
  };

  const handleSelectExam = (exam: ExamResponse) => {
    setSelectedExam(exam);
    setSearchParams({ examId: String(exam.id) });
  };

  const handleBackToList = () => {
    setSelectedExam(null);
    setSearchParams({});
  };

  const renderContent = () => {
    if (selectedPatientId === null) {
      return (
        <ContentPlaceholder message="Selecione um paciente para visualizar exames." />
      );
    }

    // Caso tenha examId na URL
    if (examIdFromUrl && !selectedExam) {
      return (
        <>
          <PatientInfoCard patientId={Number(patientIdFromUrl)} />

          {/* 🔥 SUBSTITUÍDO: ExamDetail → CaregiverExamDetail */}
          <CaregiverExamDetail
            examId={Number(examIdFromUrl)}
            onBack={() => {
              setSearchParams({});
              navigate(ROUTES.CAREGIVER.EXAMINATION);
            }}
          />

          <div className="mt-6">
            <ExamResultUpload examId={Number(examIdFromUrl)} />
          </div>
        </>
      );
    }

    if (selectedExam) {
      return (
        <>
          <PatientInfoCard patientId={selectedExam.patientId} />

          {/* 🔥 SUBSTITUÍDO */}
          <CaregiverExamDetail
            examId={selectedExam.id}
            onBack={handleBackToList}
          />

          <div className="mt-6">
            <ExamResultUpload examId={selectedExam.id} />
          </div>
        </>
      );
    }

    return (
      <>
        <PatientInfoCard patientId={selectedPatientId} />

        <ExamList
          patientId={selectedPatientId}
          onSelectExam={handleSelectExam}
          selectedExamId={selectedExam?.id}
        />
      </>
    );
  };

  return (
    <main className="grid h-full gap-6 lg:grid-cols-[360px_1fr]">
      <CaregiverPatientList
        caregiverId={caregiverId ? Number(caregiverId) : 0}
        onSelectPatient={handleSelectPatient}
        initialSearchTerm=""
      />

      <div className="h-full overflow-y-auto flex flex-col gap-6">
        {renderContent()}
      </div>
    </main>
  );
}
