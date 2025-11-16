import { Outlet } from "react-router";
import { Topbar } from "~/components/TopBar/Topbar";
import AccountMenu from "~/components/TopBar/AccountMenu";
import { useAuth } from "~/hooks/useAuth";
import DoctorSideBar from "../Doctor/Sidebar";

// 1. Importe o IconButton, Ícones e o NotificationBell
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import IconButton from "@mui/material/IconButton";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationBell from "~/components/notifications/NotificationBell";

export default function PrivateLayout() {
  const { user } = useAuth();
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
            className="!bg-white rounded-full w-10 h-10 hover:!bg-gray-100"
          >
            <ForumIcon className="text-green-500" />
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
