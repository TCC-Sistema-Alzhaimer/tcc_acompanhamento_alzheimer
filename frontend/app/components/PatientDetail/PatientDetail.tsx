import React from "react";
import { usePatientDetails } from "./hook/usePatientDetail";
import { FileText, CalendarCheck, Calendar } from "lucide-react";
import Button from "~/components/Button";

interface PatientDetailsProps {
  patientId: number | null;
}

const calculateAge = (birthdate: Date | string) => {
  try {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  } catch (error) {
    return "?";
  }
};

export function PatientDetails({ patientId }: PatientDetailsProps) {
  const { patient, isLoading } = usePatientDetails(patientId);

  if (patientId === null) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 p-6 rounded-lg border-2 border-dashed border-gray-300">
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

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>Não foi possível carregar os dados deste paciente.</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 h-full">
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-gray-800">
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

      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-gray-800">Histórico resumido</h3>

        <div className="flex flex-col gap-4 border-l-2 border-gray-200 pl-6 ml-3">
          <div className="flex items-center gap-4 relative">
            <div className="absolute -left-[1.65rem] top-1 w-6 h-6 rounded-full bg-teal-300 flex items-center justify-center text-white">
              <FileText size={12} />
            </div>
            <div>
              <strong className="text-sm font-bold text-gray-800">
                Exame: A
              </strong>
              <p className="text-xs text-gray-500">26/04/2025</p>
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <div className="absolute -left-[1.65rem] top-1 w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white">
              <CalendarCheck size={12} />
            </div>
            <div>
              <strong className="text-sm font-bold text-gray-800">
                Consulta Realizada
              </strong>
              <p className="text-xs text-gray-500">20/04/2025</p>
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <div className="absolute -left-[1.65rem] top-1 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
              <Calendar size={12} />
            </div>
            <div>
              <strong className="text-sm font-bold text-gray-800">
                Consulta marcada
              </strong>
              <p className="text-xs text-gray-500">05/04/2025</p>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => console.log("Ver histórico completo")}
        >
          Ver histórico completo
        </Button>
      </div>
    </section>
  );
}
