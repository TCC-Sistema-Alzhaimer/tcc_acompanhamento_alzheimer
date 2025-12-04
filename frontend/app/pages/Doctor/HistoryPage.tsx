import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";
import { usePatientHistory } from "~/components/history/hooks/usePatientHistory";
import { HistoryItemCard } from "~/components/history/HistoryItemCard";
import { PatientInfoCard } from "~/components/PatientDetail/PatientInfoCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Histórico | MedAlz" },
    { name: "DoctorHistory", content: "Histórico médico do paciente" },
  ];
}

export default function DoctorHistoryPage() {
  const { user } = useAuth();
  const location = useLocation();
  const loggedDoctorId = user?.id;
  const navigate = useNavigate();

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () => location.state?.defaultPatientId || null
  );

  const { history, isLoading } = usePatientHistory(selectedPatientId);

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
  };

  return (
    <main className="grid h-full overflow-hidden gap-6 lg:grid-cols-[360px_1fr]">
      <PatientList
        doctorId={Number(loggedDoctorId) || 0}
        onSelectPatient={handleSelectPatient}
        onCreatePatient={() => navigate(ROUTES.DOCTOR.PATIENTS)}
      />

      <div className="h-full overflow-y-auto flex flex-col gap-6">
        {selectedPatientId === null ? (
          <div className="flex items-center justify-center h-full text-gray-700 p-6 rounded-lg border-2 border-dashed border-gray-300 bg-white">
            <p>Selecione um paciente na lista para ver o histórico.</p>
          </div>
        ) : (
          <>
            <PatientInfoCard patientId={selectedPatientId} />

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-800">Histórico</h3>

              {isLoading && (
                <p className="text-gray-700">Carregando histórico...</p>
              )}

              {!isLoading && history.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-gray-600">
                  <p className="text-sm font-semibold">
                    Nenhum histórico encontrado
                  </p>
                  <p className="text-xs">
                    Este paciente ainda não possui registros.
                  </p>
                </div>
              )}

              {!isLoading && history.length > 0 && (
                <div className="relative ml-4">
                  {/* Linha do tempo vertical */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300" />

                  <div className="flex flex-col gap-4">
                    {history.map((item, index) => (
                      <HistoryItemCard
                        key={`${item.itemType}-${item.id}`}
                        item={item}
                        isLast={index === history.length - 1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
