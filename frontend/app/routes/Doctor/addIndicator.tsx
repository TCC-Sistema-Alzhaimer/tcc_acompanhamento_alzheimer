import DoctorAddIndicatorPage from "~/pages/Doctor/AddIndicatorPage";
import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AddIndicator" },
    { name: "AddIndicator", content: "Form para adicionar indicadores" },
  ];
}

export default function DoctorAddIndicator() {
  return <DoctorAddIndicatorPage />;
}
