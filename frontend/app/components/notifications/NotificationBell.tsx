import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { getUserNotifications } from "~/services/notificationService";
import NotificationList from "./NotificationList";
import type { NotificationRecipientResponse } from "~/types/notifications/NotificationResponse";

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<
    NotificationRecipientResponse[]
  >([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications(true);
      setNotifications(data);
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <div className="relative">
      <IconButton
        onClick={handleToggle}
        className="!bg-white rounded-full w-10 h-10 hover:!bg-gray-100 shadow-md"
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon className="text-green-500" />
        </Badge>
      </IconButton>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl z-50 border border-gray-200">
          <NotificationList
            notifications={notifications}
            onClose={() => setOpen(false)}
            refresh={fetchNotifications}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
