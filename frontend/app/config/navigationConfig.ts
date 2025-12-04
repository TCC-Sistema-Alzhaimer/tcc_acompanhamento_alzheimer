import { ROUTES } from "~/routes/EnumRoutes";
import { SystemRoles } from "~/types/SystemRoles";
import {
  Home,
  Users,
  FileText,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  Shield,
  UserCircle,
  CalendarDays,
  History,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: any;
}

export const ROLE_NAVIGATION: Record<string, NavItem[]> = {
  [SystemRoles.DOCTOR]: [
    { label: "Início", to: ROUTES.PRIVATE_HOME, icon: Home },
    { label: "Pacientes", to: ROUTES.DOCTOR.PATIENTS, icon: Users },
    { label: "Exames", to: ROUTES.DOCTOR.EXAMINATION, icon: FileText },
    { label: "Conclusões", to: ROUTES.DOCTOR.CONCLUSION, icon: ClipboardCheck },
    { label: "Histórico", to: ROUTES.DOCTOR.HISTORY, icon: History },
    { label: "Dashboard", to: ROUTES.DOCTOR.DASHBOARD, icon: LayoutDashboard },
  ],
  [SystemRoles.ADMIN]: [
    { label: "Início", to: ROUTES.PRIVATE_HOME, icon: Home },
    { label: "Gerenciar Usuários", to: ROUTES.ADMIN.MANAGEMENT, icon: Shield },
    { label: "Associações", to: ROUTES.ASSOCIATION, icon: Users },
  ],
  [SystemRoles.PATIENT]: [
    { label: "Início", to: ROUTES.PRIVATE_HOME, icon: Home },
  ],
  [SystemRoles.CAREGIVER]: [
    { label: "Início", to: ROUTES.PRIVATE_HOME, icon: Home },
    { label: "Meus Pacientes", to: "/caregiver/patients", icon: Users },
    { label: "Exames", to: ROUTES.CAREGIVER.EXAMINATION, icon: FileText },
  ],
};
