import Sidebar from "~/components/Sidebar";
import { ROUTES } from "~/routes/EnumRoutes";
import {
  Home,
  Users,
  FileText,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Início", to: ROUTES.PRIVATE_HOME, icon: Home },
  { label: "Pacientes", to: ROUTES.DOCTOR.PATIENTS, icon: Users },
  { label: "Exames", to: ROUTES.DOCTOR.EXAMINATION, icon: FileText },
  { label: "Conclusões", to: ROUTES.DOCTOR.CONCLUSION, icon: ClipboardCheck },
  { label: "Dashboard", to: ROUTES.DOCTOR.DASHBOARD, icon: LayoutDashboard },
  // { label: "Configurações", to: "/settings", icon: Settings }, // Exemplo
];

interface DoctorSideBarProps {
  isCollapsed: boolean;
}

function DoctorSideBar({ isCollapsed }: DoctorSideBarProps) {
  return (
    <Sidebar.Root isCollapsed={isCollapsed}>
      {navItems.map((item) => (
        <Sidebar.Option
          key={item.label}
          to={item.to}
          icon={item.icon}
          isCollapsed={isCollapsed}
        >
          {item.label}
        </Sidebar.Option>
      ))}
    </Sidebar.Root>
  );
}

export default DoctorSideBar;
