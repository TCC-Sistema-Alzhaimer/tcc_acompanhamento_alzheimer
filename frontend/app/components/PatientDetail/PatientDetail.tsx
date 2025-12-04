import React from "react";
import { usePatientDetails } from "./hooks/usePatientDetail";
import { FileText, CalendarCheck, Calendar, History } from "lucide-react";
import Button from "~/components/Button";
import { usePatientHistory } from "./hooks/usePatientHistory";
import { ROUTES } from "~/routes/EnumRoutes";
import { useNavigate } from "react-router";
import { PatientInfoCard } from "./PatientInfoCard";
import { useAuth } from "~/hooks/useAuth";

interface PatientDetailsProps {
  patientId: number | null;
}

export function PatientDetails({ patientId }: PatientDetailsProps) {
  const { patient, isLoading: isLoadingPatient } = usePatientDetails(patientId);
  const { exams, isLoading: isLoadingHistory } = usePatientHistory(patientId);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (patientId === null) {
    return (
      <div className="flex items-center justify-center h-full text-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300">
        <p>Selecione um paciente na lista para ver os detalhes.</p>
      </div>
    );
  }

  if (isLoadingPatient) {
    return (
      <div className="flex items-center justify-center h-full text-gray-800">
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

  const handleShowCompleteHistory = () => {
    if (patientId) {
      let historyPath = ROUTES.DOCTOR.HISTORY;
      console.log("User role:", user?.role);
      if (user?.role === "CAREGIVER"){
        navigate(ROUTES.CAREGIVER.HISTORY, {
        state: { defaultPatientId: patientId },
        });
        return;
      }
      navigate(historyPath, {
        state: { defaultPatientId: patientId },
      });
    } else {
      console.error(
        "Não é possível navegar para o histórico sem um ID de paciente."
      );
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <PatientInfoCard patientId={patientId} />

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Histórico resumido
        </h3>

        {isLoadingHistory ? (
          <div className="text-sm text-gray-600">Carregando histórico...</div>
        ) : (
          <div className="flex flex-col gap-3 border-l-2 border-gray-300 pl-6 ml-3">
            {exams.map((exam) => (
              <div key={exam.id} className="flex items-center gap-3 relative">
                <div className="absolute -left-[1.65rem] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center text-white">
                  <FileText size={10} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {exam.examTypeDescription}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(exam.requestDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}

            {exams.length === 0 && !isLoadingHistory && (
              <p className="text-sm text-gray-500">Nenhum exame encontrado.</p>
            )}
          </div>
        )}

        <div className="mt-4">
          <Button variant="primary" onClick={handleShowCompleteHistory}>
            <History size={20} className="flex-shrink-0" />
            <span className="ml-2">Ver histórico completo</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
