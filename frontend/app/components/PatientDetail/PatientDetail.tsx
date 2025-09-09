interface PatientDetailProps {
  patientId: number;
}

export function PatientDetail({ patientId }: PatientDetailProps) {
  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Detalhes do Paciente #{patientId}</h2>
      <p>Aqui você pode exibir informações resumidas do paciente.</p>

      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Ação 1
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
          Ação 2
        </button>
      </div>
    </div>
  );
}
