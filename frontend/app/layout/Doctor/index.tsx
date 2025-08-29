import { Outlet } from "react-router";
import DoctorSideBar from "./Sidebar";
import { AuthGuard } from "~/guards/authGuard";
import { Topbar } from "./Topbar";
import AccountMenu from "./TopbarItem/AccountMenu";
import ActionButton from "~/components/ActionButton";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { SystemRoles } from "~/types/SystemRoles";

function DoctorLayout() {
  return (
    <AuthGuard allowRoles={[SystemRoles.DOCTOR, SystemRoles.ADMIN]}>
      <div className="flex flex-col h-screen">
        <div>
          <Topbar>
            <ActionButton title="Mensagens">
              <ForumIcon />
            </ActionButton>
            <ActionButton title="Notificações">
              <NotificationsIcon />
            </ActionButton>
            <AccountMenu />
          </Topbar>
        </div>

        <div className="flex flex-row h-full">
          <DoctorSideBar />
          <div className="w-4/5 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default DoctorLayout;
