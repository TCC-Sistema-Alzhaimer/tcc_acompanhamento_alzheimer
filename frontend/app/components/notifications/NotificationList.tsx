// src/components/notifications/NotificationList.tsx
import React from "react";
import type { NotificationRecipientResponse } from "~/types/notifications/NotificationResponse";
import { NotificationType } from "~/types/notifications/NotificationType";
import { markNotificationAsRead } from "~/services/notificationService";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ROUTES } from "~/routes/EnumRoutes";

interface Props {
  notifications: NotificationRecipientResponse[];
  onClose: () => void;
  refresh: () => void;
}

const NotificationList: React.FC<Props> = ({
  notifications,
  onClose,
  refresh,
}) => {
  const navigate = useNavigate();

  const handleClick = async (n: NotificationRecipientResponse) => {
    if (!n.notificationId) return;
    try {
      await markNotificationAsRead(n.notificationId);
      refresh();
      onClose();
      console.log(n.type);
      switch (n.type) {
        case NotificationType.RELATIONAL_UPDATE:
          navigate(ROUTES.ASSOCIATION);
          break;
        case NotificationType.EXAM_REMINDER:
          navigate(ROUTES.DOCTOR.EXAMINATION);
          break;
        case NotificationType.EXAM_REMINDER:
          navigate(ROUTES.DOCTOR.EXAMINATION);
          break;
        default:
          navigate(ROUTES.HOME);
          break;
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-medium text-gray-700">
          Nenhuma nova notificação
        </p>
      </div>
    );
  }

  return (
    <ul className="max-h-96 overflow-y-auto divide-y divide-gray-200">
      {notifications.map((n, index) => (
        <li
          key={n.notificationId ?? `notification-${index}`}
          className="p-3 hover:bg-gray-100 cursor-pointer flex flex-col"
          onClick={() => {
            console.log("clicou na notificação", n);
            handleClick(n);
          }}
        >
          <span className="font-semibold text-gray-800">{n.title}</span>
          <span className="text-sm text-gray-600">{n.message}</span>
          <span className="text-xs text-gray-700 mt-1">
            {formatDistanceToNow(new Date(n.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;
