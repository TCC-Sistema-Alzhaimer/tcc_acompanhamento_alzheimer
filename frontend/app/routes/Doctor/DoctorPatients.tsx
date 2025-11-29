import type { Route } from "../../+types/root";
import DoctorPatientsPage from "~/pages/Doctor/DoctorPatientsPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pacientes" },
    { name: "description", content: "Visão geral dos pacientes" },
  ];
}

export default function DoctorPatients() {
  return <DoctorPatientsPage />;
}
