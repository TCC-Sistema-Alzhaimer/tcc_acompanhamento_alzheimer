import { PatientList } from "~/components/UserList/PatientList";
import React, { useState, useMemo, useCallback } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { usePatientIndicators } from "~/components/dashboard/hooks/usePatientsIndicators";
import { BioindicatorChart } from "~/components/dashboard/BioIndicatorChart";
import { PatientInfoCard } from "~/components/PatientDetail/PatientInfoCard";
import { ROUTES } from "~/routes/EnumRoutes";
import Button from "~/components/Button";
import { Plus } from "lucide-react";
import { IndicatorManager } from "~/components/dashboard/IndicatorManager";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const loggedDoctorId = user?.id;

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () => location.state?.defaultPatientId || null
  );

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const { indicators, isLoading } = usePatientIndicators(selectedPatientId);

  const [managingType, setManagingType] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const chartData = useMemo(() => {
    const bio1 = indicators.filter((i) => i.tipoId === 1);
    const bio2 = indicators.filter((i) => i.tipoId === 2);
    const bio3 = indicators.filter((i) => i.tipoId === 3);
    const bio4 = indicators.filter((i) => i.tipoId === 4);

    return { bio1, bio2, bio3, bio4 };
  }, [indicators]);

  const handleSelectPatient = (id: number) => setSelectedPatientId(id);

  return (
    <main className="grid h-full gap-6 lg:grid-cols-[360px_1fr]">
      <PatientList
        doctorId={Number(loggedDoctorId) || 0}
        onSelectPatient={handleSelectPatient}
        onCreatePatient={() => navigate(ROUTES.DOCTOR.PATIENTS)}
      />

      <div className="h-full overflow-y-auto flex flex-col gap-6 p-6">
        {selectedPatientId === null ? (
          <div className="flex items-center justify-center h-full text-gray-800 p-6 border-2 border-dashed rounded-lg">
            <p>Selecione um paciente.</p>
          </div>
        ) : (
          <>
            <PatientInfoCard patientId={selectedPatientId} />
            <Button
              className="w-fit"
              onClick={() =>
                navigate(ROUTES.DOCTOR.ADD_INDICATOR, {
                  state: { defaultPatientId: selectedPatientId },
                })
              }
            >
              <Plus size={20} className="mr-2" /> Novo Indicador
            </Button>

            {/* Grid de Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              <BioindicatorChart
                title="Nível de Atividade Física"
                data={chartData.bio1}
                isLoading={isLoading}
                color="#10b981" // Verde
                onManage={() =>
                  setManagingType({ id: 1, title: "Nível de Atividade Física" })
                }
              />
              <BioindicatorChart
                title="Qualidade do Sono"
                data={chartData.bio2}
                isLoading={isLoading}
                color="#3b82f6" // Azul
                onManage={() =>
                  setManagingType({ id: 2, title: "Qualidade do Sono" })
                }
              />
              <BioindicatorChart
                title="Nível de Agitação"
                data={chartData.bio3}
                isLoading={isLoading}
                color="#f59e0b" // Laranja
                onManage={() =>
                  setManagingType({ id: 3, title: "Nível de Agitação" })
                }
              />
              <BioindicatorChart
                title="Cognição"
                data={chartData.bio4}
                isLoading={isLoading}
                color="#8b5cf6" // Roxo
                onManage={() => setManagingType({ id: 4, title: "Cognição" })}
              />
            </div>

            {/* Modal de Gerenciamento */}
            {managingType && (
              <IndicatorManager
                isOpen={!!managingType}
                title={managingType.title}
                data={indicators.filter((i) => i.tipoId === managingType.id)}
                onClose={() => setManagingType(null)}
                onRefresh={() => window.location.reload()}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
