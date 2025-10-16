import { NotificationResponse } from "@/types/api/notification";
import { api } from "./api";
import { ROUTES } from "./routes";

interface NotificationRequestBase {
  accessToken: string;
}

interface NotificationByPatientRequest extends NotificationRequestBase {
  patientId: string;
}

interface MarkAsReadRequest extends NotificationRequestBase {
  notificationId: string;
  readerId: string;
}

export async function fetchNotificationsByPatient({
  accessToken,
  patientId,
}: NotificationByPatientRequest): Promise<NotificationResponse[]> {
  const resp = await api.get(ROUTES.NOTIFICATIONS_BY_PATIENT_ID(patientId), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (resp.status !== 200) {
    throw new Error("Falha ao buscar notificações para o paciente.");
  }

  return resp.data;
}

export async function markNotificationAsRead({
  accessToken,
  notificationId,
  readerId,
}: MarkAsReadRequest): Promise<void> {
  const resp = await api.patch(
    ROUTES.NOTIFICATION_MARK_AS_READ(notificationId, readerId),
    null,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (resp.status !== 200) {
    throw new Error("Falha ao marcar notificação como lida.");
  }
  return;
}
