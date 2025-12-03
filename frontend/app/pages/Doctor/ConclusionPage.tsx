import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ConclusionForm } from "~/components/conclusion/ConclusionForm";
import { ConclusionList } from "~/components/conclusion/ConclusionList";
import { ConclusionDetail } from "~/components/conclusion/ConclusionDetail";
import { PatientInfoCard } from "~/components/PatientDetail/PatientInfoCard";
import { ROUTES } from "~/routes/EnumRoutes";
import { PlusCircle, List } from "lucide-react";
import {
  getConclusionById,
  type ConclusionResponseDTO,
} from "~/services/doctorService";
import { TabPanel, ContentPlaceholder, type TabItem } from "~/components/ui";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Conclusões Médicas" },
    {
      name: "DoctorConclusion",
      content: "Gerenciamento de conclusões médicas",
    },
  ];
}

type TabType = "create" | "list";

const TABS: TabItem[] = [
  { id: "list", label: "Conclusões Registradas", icon: List },
  { id: "create", label: "Nova Conclusão", icon: PlusCircle },
];

export default function DoctorConclusionPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const loggedDoctorId = user?.id;

  const tabFromUrl = searchParams.get("tab") as TabType | null;
  const conclusionIdFromUrl = searchParams.get("conclusionId");

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () => location.state?.defaultPatientId || null
  );

  const defaultExamId = location.state?.defaultExamId || null;

  const [activeTab, setActiveTab] = useState<TabType>(
    () => tabFromUrl || (defaultExamId ? "create" : "list")
  );
  const [selectedConclusion, setSelectedConclusion] =
    useState<ConclusionResponseDTO | null>(null);

  // Carregar conclusão quando vem da URL
  useEffect(() => {
    if (conclusionIdFromUrl && !selectedConclusion) {
      const fetchConclusion = async () => {
        try {
          const conclusion = await getConclusionById(
            Number(conclusionIdFromUrl)
          );
          setSelectedConclusion(conclusion);
          // Se tiver patientId na conclusão, selecioná-lo também
          if (conclusion.patientId && !selectedPatientId) {
            setSelectedPatientId(conclusion.patientId);
          }
        } catch (error) {
          console.error("Erro ao carregar conclusão:", error);
        }
      };
      fetchConclusion();
    }
  }, [conclusionIdFromUrl]);

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
    setSelectedConclusion(null);
    setSearchParams({});
  };

  const handleSelectConclusion = (conclusion: ConclusionResponseDTO) => {
    setSelectedConclusion(conclusion);
    setSearchParams({ tab: "list", conclusionId: String(conclusion.id) });
  };

  const handleBackToList = () => {
    setSelectedConclusion(null);
    setSearchParams({ tab: "list" });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
    setSelectedConclusion(null);
    setSearchParams({ tab });
  };

  const renderContent = () => {
    if (selectedPatientId === null) {
      return (
        <ContentPlaceholder message="Selecione um paciente na lista para gerenciar conclusões." />
      );
    }

    // Se tem conclusão selecionada, mostra detalhes
    if (selectedConclusion) {
      return (
        <>
          <PatientInfoCard patientId={selectedPatientId} />
          <ConclusionDetail
            conclusionId={selectedConclusion.id}
            onBack={handleBackToList}
          />
        </>
      );
    }

    // Tabs para criar ou listar
    return (
      <>
        <PatientInfoCard patientId={selectedPatientId} />

        <TabPanel
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        >
          {activeTab === "list" ? (
            <ConclusionList
              patientId={selectedPatientId}
              onSelectConclusion={handleSelectConclusion}
              selectedConclusionId={selectedConclusion?.id}
            />
          ) : (
            <ConclusionForm
              patientId={selectedPatientId}
              doctorId={Number(loggedDoctorId) || 0}
              defaultExamId={defaultExamId}
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
