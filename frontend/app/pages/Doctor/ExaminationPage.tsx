import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ExamRequest } from "~/components/exam/ExamRequest";
import { ExamList } from "~/components/exam/ExamList";
import { ExamDetail } from "~/components/exam/ExamDetail";
import { PatientInfoCard } from "~/components/PatientDetail/PatientInfoCard";
import { ROUTES } from "~/routes/EnumRoutes";
import { PlusCircle, List } from "lucide-react";
import type { ExamResponse } from "~/types/exam/examResponse";
import { TabPanel, ContentPlaceholder, type TabItem } from "~/components/ui";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exames" },
    { name: "DoctorExamination", content: "Gerenciamento de exames" },
  ];
}

type TabType = "request" | "list";

const TABS: TabItem[] = [
  { id: "list", label: "Exames Solicitados", icon: List },
  { id: "request", label: "Solicitar Exame", icon: PlusCircle },
];

export default function DoctorExaminationPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const loggedDoctorId = user?.id;

  // State from URL params or location state
  const examIdFromUrl = searchParams.get("examId");
  const patientIdFromUrl = searchParams.get("patientId");
  const tabFromUrl = searchParams.get("tab") as TabType | null;

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () =>
      location.state?.defaultPatientId ||
      (patientIdFromUrl ? Number(patientIdFromUrl) : null)
  );
  const [activeTab, setActiveTab] = useState<TabType>(
    () => tabFromUrl || (examIdFromUrl ? "list" : "list")
  );
  const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);

  // Se veio com examId na URL, mostra detalhes do exame
  useEffect(() => {
    if (examIdFromUrl) {
      setActiveTab("list");
    }
  }, [examIdFromUrl]);

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
    setSelectedExam(null);
    // Limpa examId da URL quando seleciona outro paciente
    if (examIdFromUrl) {
      setSearchParams({});
    }
  };

  const handleSelectExam = (exam: ExamResponse) => {
    setSelectedExam(exam);
    setSearchParams({ tab: "list", examId: String(exam.id) });
  };

  const handleBackToList = () => {
    setSelectedExam(null);
    setSearchParams({ tab: "list" });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
    setSelectedExam(null);
    setSearchParams({ tab });
  };

  const renderContent = () => {
    if (selectedPatientId === null && !examIdFromUrl) {
      return (
        <ContentPlaceholder message="Selecione um paciente na lista para gerenciar exames." />
      );
    }

    // Se tem examId na URL, mostra detalhes diretamente
    if (examIdFromUrl && !selectedExam) {
      return (
        <>
          {patientIdFromUrl && (
            <PatientInfoCard patientId={Number(patientIdFromUrl)} />
          )}
          <ExamDetail
            examId={Number(examIdFromUrl)}
            onBack={() => {
              setSearchParams({});
              navigate(ROUTES.DOCTOR.EXAMINATION);
            }}
          />
        </>
      );
    }

    // Se tem exame selecionado, mostra detalhes
    if (selectedExam) {
      return (
        <>
          <PatientInfoCard patientId={selectedExam.patientId} />
          <ExamDetail examId={selectedExam.id} onBack={handleBackToList} />
        </>
      );
    }

    // Tabs para solicitar ou listar
    return (
      <>
        <PatientInfoCard patientId={selectedPatientId!} />

        <TabPanel
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        >
          {activeTab === "list" ? (
            <ExamList
              patientId={selectedPatientId!}
              onSelectExam={handleSelectExam}
              selectedExamId={selectedExam?.id}
            />
          ) : (
            <ExamRequest
              patientId={selectedPatientId!}
              doctorId={Number(loggedDoctorId) || 0}
            />
          )}
        </TabPanel>
      </>
    );
  };

  return (
    <main className="grid h-full gap-6 lg:grid-cols-[360px_1fr]">
      <PatientList
        doctorId={Number(loggedDoctorId) || 0}
        onSelectPatient={handleSelectPatient}
        onCreatePatient={() => navigate(ROUTES.DOCTOR.PATIENTS)}
      />

      <div className="h-full overflow-y-auto flex flex-col gap-6">
        {renderContent()}
      </div>
    </main>
  );
}
