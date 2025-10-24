import Button from "~/components/Button";

interface QuickActionsProps {
  patientId: number | null;
  onExamRequest: () => void;
}

export function QuickActions({ patientId, onExamRequest }: QuickActionsProps) {
  const isDisabled = patientId === null;

  return (
    <section>
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-gray-800">Ações Rápidas</h3>

        <div className="flex flex-col gap-3">
          <Button onClick={onExamRequest}>Solicitar Exame</Button>
          <Button variant="secondary" disabled={isDisabled}>
            Registrar Conclusão
          </Button>

          <div className="flex gap-3">
            <Button variant="secondary" disabled={isDisabled}>
              Chat
            </Button>
            <Button variant="secondary" disabled={isDisabled}>
              Ver mais
            </Button>
          </div>

          <Button disabled={isDisabled}>Dashboard</Button>
        </div>
      </div>
    </section>
  );
}
