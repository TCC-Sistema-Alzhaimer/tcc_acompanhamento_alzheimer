import { api } from "./api";
import type { NotificationRecipientResponse } from "~/types/notifications/NotificationResponse";

export const getUserNotifications = async (
  unreadOnly = false
): Promise<NotificationRecipientResponse[]> => {
  const response = await api.get(`/notifications`, {
    params: { unreadOnly },
  });
  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: number,
) => {
  return api.patch(`/notifications/${notificationId}/read`);
};
