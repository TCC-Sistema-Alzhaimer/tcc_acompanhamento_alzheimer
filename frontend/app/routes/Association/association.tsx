import AssociationRequests from "~/pages/Association/AssociationRequestsPage";
import type { Route } from "../../+types/root";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Associação de usuários" },
    { name: "Association", content: "Association page" },
  ];
}

export default function Association() {
  return (
    <AssociationRequests />
  );
}