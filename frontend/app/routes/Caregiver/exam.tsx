import ExamPage from "~/pages/Caregiver/ExamPage";
import type { Route } from "../../+types/root";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verificar Exames" },
    { name: "checkExams", content: "Caregiver page" },
  ];
}

export default function Exam() {
  return (
    <ExamPage />
  );
}