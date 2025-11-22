import { Outlet, useNavigate } from "react-router";
import { Topbar } from "~/components/TopBar/Topbar";
import AccountMenu from "~/components/TopBar/AccountMenu";
import DoctorSideBar from "../Doctor/Sidebar";

// 1. Importe o IconButton, Ícones e o NotificationBell
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import IconButton from "@mui/material/IconButton";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationBell from "~/components/notifications/NotificationBell";
import { useChatUnreadCount } from "~/hooks/useChatUnreadCount";
import { ROUTES } from "~/routes/EnumRoutes";
import ChatUnreadBadge from "~/components/chat/UnreadBadge";
import { useAuth } from "~/hooks/useAuth";

export default function PrivateLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { unreadChats } = useChatUnreadCount();
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "sidebar-collapsed",
    false
  );
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Topbar isCollapsed={isCollapsed} onToggle={toggleSidebar}>
        <div className="flex items-center gap-2 ml-auto">
          <IconButton
            title="Mensagens"
            className="!bg-white rounded-full w-10 h-10 hover:!bg-gray-100 shadow-md border border-gray-200 !overflow-visible"
            onClick={() => navigate(ROUTES.CHAT)}
          >
            <div className="relative">
              <ForumIcon className="text-green-500" />
              <ChatUnreadBadge count={unreadChats} />
            </div>
          </IconButton>

          <NotificationBell />

          <AccountMenu />
        </div>
      </Topbar>

      <div className="flex flex-1 overflow-hidden">
        <DoctorSideBar isCollapsed={isCollapsed} />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
