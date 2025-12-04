import CaregiverPatientsPage from "~/pages/Caregiver/CaregiverPatientsPage";
import type { Route } from "../../+types/root";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pacientes" },
    { name: "Pacientes", content: "Caregiver page" },
  ];
}

export default function Exam() {
  return (
    <CaregiverPatientsPage />
  );
}