import { NavLink } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import React from "react";

export interface SidebarOptionProps {
  to: LinkProps["to"];
  children: React.ReactNode;
  icon: React.ElementType;
  isCollapsed: boolean;
}

export function SidebarOption({
  to,
  children,
  icon: Icon,
  isCollapsed,
}: SidebarOptionProps) {
  const activeClasses = "bg-green-500 text-white shadow-lg";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100";

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => `
        flex items-center p-3 rounded-lg
        transition-colors duration-200
        ${isActive ? activeClasses : inactiveClasses}
      `}
    >
      <Icon size={20} className="flex-shrink-0" />

      <span
        className={`
          overflow-hidden transition-all duration-200 font-semibold
          ${isCollapsed ? "w-0 ml-0" : "w-full ml-3"}
        `}
      >
        {children}
      </span>
    </NavLink>
  );
}
