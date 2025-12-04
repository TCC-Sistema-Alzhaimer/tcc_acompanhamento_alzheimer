import type { Route } from "../../+types/root";
import ConclusionPage from "~/pages/Doctor/ConclusionPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adicionar conclusão" },
    { name: "ConclusionExam", content: "Adicionar conclusão médica" },
  ];
}

export default function Conclusion() {
  return <ConclusionPage />;
}
