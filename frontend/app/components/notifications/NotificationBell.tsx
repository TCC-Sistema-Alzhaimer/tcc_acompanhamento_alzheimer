import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { getUserNotifications } from "~/services/notificationService";
import NotificationList from "./NotificationList";
import type { NotificationRecipientResponse } from "~/types/notifications/NotificationResponse";
import { fa } from "zod/v4/locales";

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationRecipientResponse[]>([]);
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
      <IconButton color="inherit" onClick={handleToggle}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
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
