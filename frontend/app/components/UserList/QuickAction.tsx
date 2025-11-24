import Button from "~/components/Button";
import { ROUTES } from "~/routes/EnumRoutes";
import { useChatUnreadCount } from "~/hooks/useChatUnreadCount";
import ChatUnreadBadge from "~/components/chat/UnreadBadge";

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
  const { unreadChats } = useChatUnreadCount();
  const showUnreadPill = unreadChats > 0;

  return (
    <section>
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-gray-800">Ações Rápidas</h3>

        <div className="flex flex-col gap-3">
          <Button disabled={isDisabled} onClick={onExamRequest}>
            Solicitar Exame
          </Button>
          <Button
            disabled={isDisabled}
            variant="secondary"
            onClick={onRegisterConclusion}
          >
            Registrar Conclusão
          </Button>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              disabled={isDisabled}
              to={ROUTES.CHAT}
              className="relative overflow-visible"
            >
              Chat
              <ChatUnreadBadge count={showUnreadPill ? unreadChats : 0} />
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
