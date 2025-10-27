import ExaminationPage from "~/pages/Doctor/ExaminationPage";
import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Solicitar Exames" },
    { name: "Exam", content: "Doctor page" },
  ];
}

export default function Examination() {
  return <ExaminationPage />;
}
