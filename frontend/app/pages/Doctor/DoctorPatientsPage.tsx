import { useState } from "react";
import { PatientList } from "~/components/UserList/PatientList";
import { PatientDetail } from "~/components/PatientDetail/PatientDetail";
import { useAuth } from "~/hooks/useAuth";

// ?TODO: Implementar a lógica de busca de pacientes
export default function DoctorPatientsPage() {
  const { user } = useAuth();
  const doctorId = user?.id ? Number(user.id) : null;

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [mode, setMode] = useState<"view" | "create">("view");

  return (
    <div className="flex h-full">
      {doctorId && (
        <PatientList
          doctorId={doctorId}
          onSelectPatient={(id) => {
            setSelectedPatientId(id);
            setMode("view");
          }}
          onCreatePatient={() => setMode("create")}
        />
      )}

      <div className="flex-1 p-4">
        {mode === "view" && selectedPatientId && (
          <PatientDetail patientId={selectedPatientId} />
        )}

        {mode === "create" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Novo Paciente</h2>
            <p>
              Formulário de criação/atribuição de pacientes será implementado
              aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
