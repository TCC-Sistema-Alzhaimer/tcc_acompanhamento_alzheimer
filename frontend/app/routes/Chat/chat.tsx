import type { Route } from "../../+types/root";
import ChatPage from "~/pages/Chat/ChatPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat" },
    { name: "description", content: "Área de conversas entre usuários" },
  ];
}

export default function ChatRoute() {
  return <ChatPage />;
}
