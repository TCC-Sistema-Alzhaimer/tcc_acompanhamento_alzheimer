import React from "react";
import Sidebar from "~/components/Sidebar";
import { useAuth } from "~/hooks/useAuth";
import { ROLE_NAVIGATION } from "~/config/navigationConfig";
import { LogOut } from "lucide-react";

interface AppSidebarProps {
  isCollapsed: boolean;
}

export function AppSidebar({ isCollapsed }: AppSidebarProps) {
  const { user, logout } = useAuth();

  if (!user || !user.role) return null;

  const navItems = ROLE_NAVIGATION[user.role] || [];

  return (
    <Sidebar.Root isCollapsed={isCollapsed}>
      {navItems.map((item) => (
        <Sidebar.Option
          key={item.to}
          to={item.to}
          icon={item.icon}
          isCollapsed={isCollapsed}
        >
          {item.label}
        </Sidebar.Option>
      ))}

      <div className="mt-auto"></div>
    </Sidebar.Root>
  );
}
