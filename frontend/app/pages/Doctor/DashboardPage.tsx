import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState, useMemo } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { usePatientIndicators } from "~/components/dashboard/hooks/usePatientsIndicators";
import { BioindicatorChart } from "~/components/dashboard/BioIndicatorChart";
import { PatientInfoCard } from "~/components/PatientDetail/PatientInfoCard";
import { ROUTES } from "~/routes/EnumRoutes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "DoctorDashboard", content: "Dashboard do paciente" },
  ];
}

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const loggedDoctorId = user?.id;

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () => location.state?.defaultPatientId || null
  );

  const { indicators, isLoading } = usePatientIndicators(selectedPatientId);

  const chartData = useMemo(() => {
    const bio1 = indicators.filter((i) => i.tipoId === 1);
    const bio2 = indicators.filter((i) => i.tipoId === 2);
    const bio3 = indicators.filter((i) => i.tipoId === 3);
    const bio4 = indicators.filter((i) => i.tipoId === 4);

    return { bio1, bio2, bio3, bio4 };
  }, [indicators]);

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
            <p>Selecione um paciente na lista para ver o dashboard.</p>
          </div>
        ) : (
          <>
            <PatientInfoCard patientId={selectedPatientId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BioindicatorChart
                title="Bioindicador 1"
                data={chartData.bio1}
                isLoading={isLoading}
              />
              <BioindicatorChart
                title="Bioindicador 2"
                data={chartData.bio2}
                isLoading={isLoading}
              />
              <BioindicatorChart
                title="Bioindicador 3"
                data={chartData.bio3}
                isLoading={isLoading}
              />
              <BioindicatorChart
                title="Bioindicador 4"
                data={chartData.bio4}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
