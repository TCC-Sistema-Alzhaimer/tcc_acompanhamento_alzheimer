import { PatientList } from "~/components/UserList/PatientList";
import type { Route } from "../../+types/root";
import React, { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useLocation } from "react-router-dom";

import { usePatientDetails } from "~/components/PatientDetail/hook/usePatientDetail";
import { ConclusionForm } from "~/components/Conclusion/ConclusionForm";

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
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"></div>
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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Registrar Conclusão" },
    { name: "DoctorConclusion", content: "Registro de conclusões médicas" },
  ];
}

export default function DoctorConclusionPage() {
  const { user } = useAuth();
  const location = useLocation();
  const loggedDoctorId = user?.id;

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    () => location.state?.defaultPatientId || null
  );

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
        {selectedPatientId === null ? (
          <div className="flex items-center justify-center h-full text-gray-400 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <p>Selecione um paciente na lista para registrar uma conclusão.</p>
          </div>
        ) : (
          <>
            <PatientInfoCard patientId={selectedPatientId} />

            <ConclusionForm
              patientId={selectedPatientId}
              doctorId={Number(loggedDoctorId) || 0}
            />
          </>
        )}
      </div>
    </main>
  );
}
