import React from "react";
import { usePatientDetails } from "./hooks/usePatientDetail";

interface PatientInfoCardProps {
  patientId: number | null;
}

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

export function PatientInfoCard({ patientId }: PatientInfoCardProps) {
  const { patient, isLoading } = usePatientDetails(patientId);

  if (isLoading || !patient) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-3">
        Dados do Paciente
      </h3>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-900">
          {patient.name} • {calculateAge(patient.birthdate)} anos •{" "}
          {patient.gender}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Nascimento: {new Date(patient.birthdate).toLocaleDateString("pt-BR")}{" "}
          • ID: #{patient.id}
        </p>
      </div>
    </div>
  );
}
