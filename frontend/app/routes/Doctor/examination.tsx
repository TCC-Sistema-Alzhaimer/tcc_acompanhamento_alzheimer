import ExaminationPage from "~/pages/Doctor/ExaminationPage";
import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exames" },
    { name: "Exam", content: "Gerenciamento de exames" },
  ];
}

export default function Examination() {
  return <ExaminationPage />;
}
