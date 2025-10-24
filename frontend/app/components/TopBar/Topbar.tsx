// src/components/topbar/Topbar.tsx
import { useAuth } from "@/hooks/useAuth";
import SearchUser from "./search-user";
import NotificationBell from "~/components/notifications/NotificationBell";

interface TopbarProps {
  children?: React.ReactNode;
}

export function Topbar({ children }: TopbarProps) {
  return (
    <div className="flex items-center justify-between bg-green-500 px-6 py-2 shadow-md">
      <div className="flex items-center gap-4">
        <SearchUser />
      </div>

      <div className="flex flex-row items-center gap-3">
        <NotificationBell />
        {children}
      </div>
    </div>
  );
}
