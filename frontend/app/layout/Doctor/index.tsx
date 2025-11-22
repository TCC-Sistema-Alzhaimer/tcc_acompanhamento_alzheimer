import { Outlet, useNavigate } from "react-router";
import DoctorSideBar from "./Sidebar";
import { AuthGuard } from "~/guards/authGuard";
import { Topbar } from "./Topbar";
import AccountMenu from "./TopbarItem/AccountMenu";

// 1. Importe o IconButton e o ícone de Notificação correto
import IconButton from "@mui/material/IconButton";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationBell from "~/components/notifications/NotificationBell"; // Use o seu componente

import { SystemRoles } from "~/types/SystemRoles";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { ROUTES } from "~/routes/EnumRoutes";
import { useChatUnreadCount } from "~/hooks/useChatUnreadCount";
import ChatUnreadBadge from "~/components/chat/UnreadBadge";

function DoctorLayout() {
  const navigate = useNavigate();
  const { unreadChats } = useChatUnreadCount();
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "sidebar-collapsed",
    false
  );
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <AuthGuard allowRoles={[SystemRoles.DOCTOR, SystemRoles.ADMIN]}>
      <div className="flex flex-col h-screen bg-white">
        <Topbar isCollapsed={isCollapsed} onToggle={toggleSidebar}>
          {/* Passe os ícones como 'children' */}
          <div className="flex items-center gap-2 ml-auto">
            {/* 2. SUBSTITUA o ActionButton pelo IconButton */}
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

            {/* 3. Use o seu NotificationBell (que já usa IconButton) */}
            <NotificationBell />

            <AccountMenu />
          </div>
        </Topbar>

        <div className="flex flex-row flex-1 overflow-hidden">
          <DoctorSideBar isCollapsed={isCollapsed} />

          <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default DoctorLayout;
