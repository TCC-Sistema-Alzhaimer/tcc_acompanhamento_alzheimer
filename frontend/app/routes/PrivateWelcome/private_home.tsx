import type { Route } from "../../+types/root";
import PrivateHome from "~/pages/privateWelcome/private_home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "PrivateHome", content: "Private home" },
  ];
}

export default function Home() {
  return (
    <PrivateHome />
  );
}