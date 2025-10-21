import React from "react";
interface PatientDetailsProps {
  patientId: number | null;
}

const usePatientDetails = (id: number | null) => {
  if (id === null) {
    return { patient: null, isLoading: false };
  }
  return {
    isLoading: false,
    patient: {
      id: 12345,
      name: "João Silva",
      age: 67,
      gender: "Masculino",
      birthdate: "15/07/1957",
    },
  };
};

export function PatientDetails({ patientId }: PatientDetailsProps) {
  const { patient, isLoading } = usePatientDetails(patientId);

  if (patientId === null) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Selecione um paciente na lista para ver os detalhes.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Carregando dados do paciente...</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Card de Dados do Paciente */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-gray-800">
          Dados do Paciente: {patient?.name}
        </h3>
        <div className="bg-gray-100 rounded-lg p-5">
          <strong className="block text-base font-bold text-gray-800 mb-2">
            {patient?.name} • {patient?.age} anos • {patient?.gender}
          </strong>
          <p className="text-sm text-gray-600">
            Data de Nascimento: {patient?.birthdate} • ID: #{patient?.id}
          </p>
        </div>
      </div>

      {/* Card de Histórico Resumido (continuaria o mesmo) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5">
        {/* ... (Timeline) ... */}
      </div>
    </section>
  );
}
