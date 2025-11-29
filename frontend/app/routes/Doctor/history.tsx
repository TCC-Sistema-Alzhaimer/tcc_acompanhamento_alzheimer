import DoctorHistoryPage from "~/pages/Doctor/HistoryPage";
import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Histórico" },
    { name: "DoctorHistory", content: "Histórico médico do paciente" },
  ];
}

export default function History() {
  return <DoctorHistoryPage />;
}
