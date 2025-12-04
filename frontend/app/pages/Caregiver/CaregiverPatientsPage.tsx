import React, { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router";
import { CaregiverPatientList } from "~/components/UserList/CaregiverPatientList";
import { CaregiverQuickActions } from "~/components/UserList/CaregiverQuickActions";
import { PatientDetails } from "~/components/PatientDetail/PatientDetail";
import { ROUTES } from "~/routes/EnumRoutes";

export default function CaregiverPatientsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const { user } = useAuth();
  const caregiverId = user?.id;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
  };

  const handleViewExams = () => {
    if (!selectedPatientId) {
      alert("Selecione um paciente primeiro.");
      return;
    }
    navigate(ROUTES.CAREGIVER.EXAMINATION, {
      state: { defaultPatientId: selectedPatientId },
    });
  };

  return (
    <main className="grid h-full gap-6 lg:grid-cols-[360px_1fr]">
      <CaregiverPatientList
        caregiverId={Number(user?.id) || 0}
        onSelectPatient={handleSelectPatient}
        initialSearchTerm={initialSearch}
      />

      <div className="h-full overflow-y-auto flex flex-row gap-6">
        <div className="basis-7/12 h-full">
          <PatientDetails patientId={selectedPatientId} />
        </div>

        <div className="basis-5/12 h-full">
          <CaregiverQuickActions
            patientId={selectedPatientId}
            onViewExams={handleViewExams}
          />
        </div>
      </div>
    </main>
  );
}
