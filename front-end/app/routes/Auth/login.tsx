import LoginPage from "~/pages/Auth/Login";
import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "LoginPage", content: "Welcome to System" },
  ];
}

export default function Login() {
  return (
    <LoginPage />
  );
}