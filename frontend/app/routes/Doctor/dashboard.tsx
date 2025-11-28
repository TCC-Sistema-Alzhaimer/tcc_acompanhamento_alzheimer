import type { Route } from "../../+types/root";
import DashboardPage from "~/pages/Doctor/DashboardPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "Dashboard", content: "Dashboard do paciente" },
  ];
}

export default function Dashboard() {
  return <DashboardPage />;
}
