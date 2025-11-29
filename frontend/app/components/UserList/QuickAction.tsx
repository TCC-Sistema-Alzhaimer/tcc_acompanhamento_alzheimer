import Button from "~/components/Button";
import { ROUTES } from "~/routes/EnumRoutes";
import { useNavigate } from "react-router";
import {
  FileText,
  ClipboardCheck,
  History,
  LayoutDashboard,
} from "lucide-react";

interface QuickActionsProps {
  patientId: number | null;
  onExamRequest: () => void;
  onRegisterConclusion: () => void;
}

export function QuickActions({
  patientId,
  onExamRequest,
  onRegisterConclusion,
}: QuickActionsProps) {
  const isDisabled = patientId === null;
  const navigate = useNavigate();

  const handleHistory = () => {
    if (patientId) {
      navigate(ROUTES.DOCTOR.HISTORY, {
        state: { defaultPatientId: patientId },
      });
    }
  };

  const handleDashboard = () => {
    if (patientId) {
      navigate(ROUTES.DOCTOR.DASHBOARD, {
        state: { defaultPatientId: patientId },
      });
    }
  };

  return (
    <section>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-semibold text-gray-800">Ações Rápidas</h3>

        <div className="flex flex-col gap-3">
          <Button disabled={isDisabled} onClick={onExamRequest}>
            <FileText size={20} className="flex-shrink-0" />
            <span className="ml-2">Solicitar Exame</span>
          </Button>
          <Button
            disabled={isDisabled}
            variant="secondary"
            onClick={onRegisterConclusion}
          >
            <ClipboardCheck size={20} className="flex-shrink-0" />
            <span className="ml-2">Registrar Conclusão</span>
          </Button>

          <Button
            variant="secondary"
            disabled={isDisabled}
            onClick={handleHistory}
          >
            <History size={20} className="flex-shrink-0" />
            <span className="ml-2">Histórico</span>
          </Button>

          <Button disabled={isDisabled} onClick={handleDashboard}>
            <LayoutDashboard size={20} className="flex-shrink-0" />
            <span className="ml-2">Dashboard</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
