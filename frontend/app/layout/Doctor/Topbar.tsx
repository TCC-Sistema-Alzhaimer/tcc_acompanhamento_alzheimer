import React from "react";

import { PanelLeft, PanelRight } from "lucide-react";
import Button from "~/components/Button";

interface TopbarProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Topbar({ children, isCollapsed, onToggle }: TopbarProps) {
  return (
    <div className="flex items-center justify-between bg-primary h-16 px-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={onToggle}
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          {isCollapsed ? <PanelRight size={20} /> : <PanelLeft size={20} />}
        </Button>

        <h2 className="text-xl font-bold text-white">
          <p>Perfil: Médico</p>
        </h2>
      </div>

      <div className="flex flex-row items-center justify-end gap-3">
        {children}
      </div>
    </div>
  );
}
