import { useAuth } from "@/hooks/useAuth";
import SearchUser from "./search-user";
import NotificationBell from "~/components/notifications/NotificationBell";
import React from "react";
import { PanelLeft, PanelRight } from "lucide-react";
import Button from "~/components/Button";

interface TopbarProps {
  children?: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Topbar({ children, isCollapsed, onToggle }: TopbarProps) {
  return (
    <div className="flex items-center justify-between bg-green-500 h-16 px-4 shadow-md">
      <div className="flex items-center gap-4">
        <Button
          onClick={onToggle}
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          {isCollapsed ? <PanelRight size={20} /> : <PanelLeft size={20} />}
        </Button>

        <SearchUser />
      </div>

      <div className="flex flex-row items-center gap-3">{children}</div>
    </div>
  );
}
