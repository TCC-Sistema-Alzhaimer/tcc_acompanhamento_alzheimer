import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
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
  const [isExpanded, setIsExpanded] = useState(true);

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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div
        className={clsx(
          "flex items-center justify-between p-4",
          isExpanded && "pb-0"
        )}
      >
        <h3 className="text-base font-semibold text-gray-800">
          Dados do Paciente
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-600 transition-colors"
        >
          <ChevronDown
            size={18}
            className={clsx(
              "text-white transition-transform duration-200",
              isExpanded ? "rotate-0" : "-rotate-90"
            )}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900">
              {patient.name} • {calculateAge(patient.birthdate)} anos •{" "}
              {patient.gender}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Nascimento:{" "}
              {new Date(patient.birthdate).toLocaleDateString("pt-BR")} • ID: #
              {patient.id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
