import CaregiverConclusionPage from "~/pages/Caregiver/CaregiverConclusionPage";
import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Conclusões do Paciente" },
    { name: "Caregiver Conclusion", content: "Página de conclusões para cuidadores" },
  ];
}

export default function CaregiverConclusionRoute() {
  return <CaregiverConclusionPage />;
}
