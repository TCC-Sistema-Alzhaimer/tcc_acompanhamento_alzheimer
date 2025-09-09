import type { Route } from "../../+types/root";
import DoctorPatientsPage from "~/pages/Doctor/DoctorPatientsPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Visão geral paciente" },
    { name: "DoctorPatients", content: "Visão geral pacientes" },
  ];
}

export default function Conclusion() {
  return (
    <DoctorPatientsPage />
  );
}