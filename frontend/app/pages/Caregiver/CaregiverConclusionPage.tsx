import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation, useSearchParams } from "react-router-dom";
import { ConclusionList } from "~/components/conclusion/ConclusionList";
import { ConclusionDetail } from "~/components/conclusion/ConclusionDetail";
import { PatientInfoCard } from "~/components/PatientDetail/PatientInfoCard";
import { ContentPlaceholder } from "~/components/ui";
import { CaregiverPatientList } from "~/components/UserList/CaregiverPatientList";
import {
  getConclusionById,
  type ConclusionResponseDTO,
} from "~/services/doctorService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Histórico Médico (Cuidador)" },
    {
      name: "CaregiverConclusion",
      content: "Visualização de conclusões médicas do paciente pelo cuidador",
    },
  ];
}

export default function CaregiverConclusionPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const caregiverId = user?.id;
  const conclusionIdFromUrl = searchParams.get("conclusionId");

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () => location.state?.defaultPatientId || null
  );

  const [selectedConclusion, setSelectedConclusion] =
    useState<ConclusionResponseDTO | null>(null);

  useEffect(() => {
    if (conclusionIdFromUrl && !selectedConclusion) {
      const fetchConclusion = async () => {
        try {
          const conclusion = await getConclusionById(
            Number(conclusionIdFromUrl)
          );
          setSelectedConclusion(conclusion);

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
    setSearchParams({ conclusionId: String(conclusion.id) });
  };


  const handleBackToList = () => {
    setSelectedConclusion(null);
    setSearchParams({});
  };

  const renderContent = () => {
    if (selectedPatientId === null) {
      return (
        <ContentPlaceholder message="Selecione um paciente para visualizar o histórico médico." />
      );
    }

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

    return (
      <>
        <PatientInfoCard patientId={selectedPatientId} />
        <ConclusionList
          patientId={selectedPatientId}
          onSelectConclusion={handleSelectConclusion}
          selectedConclusionId={
            selectedConclusion ? selectedConclusion.id : undefined
          }
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
