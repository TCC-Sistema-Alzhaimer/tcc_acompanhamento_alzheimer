import { Outlet } from "react-router";
import { Topbar } from "~/components/TopBar/Topbar";
import AccountMenu from "~/components/TopBar/AccountMenu";
import ActionButton from "~/components/ActionButton";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "~/hooks/useAuth";

export default function PrivateLayout() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Topbar fixa */}
      <Topbar>
        <ActionButton title="Mensagens">
          <ForumIcon />
        </ActionButton>
        <ActionButton title="Notificações">
          <NotificationsIcon />
        </ActionButton>
        <AccountMenu />
      </Topbar>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

