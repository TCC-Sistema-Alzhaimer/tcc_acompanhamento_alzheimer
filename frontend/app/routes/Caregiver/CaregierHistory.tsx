import CaregiverHistoryPage from "~/pages/Caregiver/CaregiverHistoryPage";
import type { Route } from "../../+types/root";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Historico dos pacientes" },
    { name: "Historico dos pacientes", content: "Caregiver page" },
  ];
}

export default function Exam() {
  return (
    <CaregiverHistoryPage />
  );
}