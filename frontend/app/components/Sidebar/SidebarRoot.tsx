import React from "react";

interface SidebarRootProps {
  children: React.ReactNode;
  isCollapsed: boolean;
}

export function SidebarRoot({ children, isCollapsed }: SidebarRootProps) {
  return (
    <aside
      className={`
        flex flex-col h-full bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"} 
      `}
    >
      <nav className="flex-1 px-4 py-4 space-y-2">{children}</nav>

      <div className="mt-auto px-4 py-4 border-t border-gray-200"></div>
    </aside>
  );
}
