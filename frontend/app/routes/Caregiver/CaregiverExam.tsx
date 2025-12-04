import CaregiverExamPage from "~/pages/Caregiver/CaregiverExamPage";
import type { Route } from "../../+types/root";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exame do Pacientes" },
    { name: "Pacientes", content: "Caregiver page" },
  ];
}

export default function Exam() {
  return (
    <CaregiverExamPage />
  );
}