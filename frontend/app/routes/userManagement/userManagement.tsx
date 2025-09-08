import type { Route } from "../../+types/root";
import UserManagementPage from "~/pages/userManagement/UserManagementPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edição de usuarios" },
    { name: "UserManagementPage", content: "User Management Page" },
  ];
}

export default function UserManagement() {
  return (
    <UserManagementPage />
  );
}