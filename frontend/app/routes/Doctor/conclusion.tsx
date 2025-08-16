import type { Route } from "../../+types/root";
import ConclusionPage from "~/pages/Doctor/ConclusionPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gerar Conclusao" },
    { name: "ConclusionExam", content: "Doctor page" },
  ];
}

export default function Conclusion() {
  return (
    <ConclusionPage />
  );
}