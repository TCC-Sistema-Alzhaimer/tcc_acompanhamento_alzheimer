import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
// 1. Importe 'useNavigate' e 'ROUTES'
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";
import Button from "~/components/Button";
import { ArrowLeft } from "lucide-react";
import { usePatientDetails } from "~/components/PatientDetail/hooks/usePatientDetail";
import { usePatientHistory } from "~/components/history/hooks/usePatientHistory";
import { HistoryItemCard } from "~/components/history/HistoryItemCard";

// --- Card de Informações do Paciente (sem mudanças) ---
const PatientInfoCard = ({ patientId }: { patientId: number | null }) => {
  const { patient, isLoading } = usePatientDetails(patientId);

  const calculateAge = (birthdate: Date | string) => {
    try {
      const birth = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age;
    } catch (error) {
      return "?";
    }
  };

  if (isLoading || !patient) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="bg-gray-100 rounded-lg p-5">
          <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Dados do Paciente: {patient.name}
      </h3>
      <div className="bg-gray-100 rounded-lg p-5">
        <strong className="block text-base font-bold text-gray-800 mb-2">
          {patient.name} • {calculateAge(patient.birthdate)} anos •{" "}
          {patient.gender}
        </strong>
        <p className="text-sm text-gray-600">
          Data de Nascimento:{" "}
          {new Date(patient.birthdate).toLocaleDateString("pt-BR")} • ID: #
          {patient.id}
        </p>
      </div>
    </div>
  );
};
// --- Fim do Card ---

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Histórico Médico" },
    { name: "DoctorHistory", content: "Histórico médico do paciente" },
  ];
}

export default function DoctorHistoryPage() {
  const { user } = useAuth();
  const location = useLocation();
  const loggedDoctorId = user?.id;
  // 3. Chame o hook 'useNavigate' aqui
  const navigate = useNavigate();

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () => location.state?.defaultPatientId || null
  );

  const { history, isLoading } = usePatientHistory(selectedPatientId);

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
  };

  return (
    <main className="bg-white flex flex-row h-full">
      <div className="basis-1/4 h-full">
        <PatientList
          doctorId={Number(loggedDoctorId) || 0}
          onSelectPatient={handleSelectPatient}
          onCreatePatient={() => {}}
        />
      </div>

      <div className="flex-1 h-full overflow-y-auto bg-gray-100 p-6 flex flex-col gap-6">
        {/* O botão agora funcionará */}
        <Button
          variant="secondary"
          onClick={() => navigate(ROUTES.DOCTOR.PATIENTS)}
          className="w-fit !px-4 !py-2 text-sm"
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar para Pacientes
        </Button>

        {selectedPatientId === null ? (
          <div className="flex items-center justify-center h-full text-gray-700 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <p>Selecione um paciente na lista para ver o histórico.</p>
          </div>
        ) : (
          <>
            <PatientInfoCard patientId={selectedPatientId} />

            <div className="flex flex-col gap-6">
              {isLoading && (
                <p className="text-gray-700">Carregando histórico...</p>
              )}

              {!isLoading && history.length === 0 && (
                <p className="text-gray-700 text-center py-10">
                  Nenhum histórico encontrado para este paciente.
                </p>
              )}

              {!isLoading &&
                history.map((item) => (
                  <HistoryItemCard
                    key={`${item.itemType}-${item.id}`}
                    item={item}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
