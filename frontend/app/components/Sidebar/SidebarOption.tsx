import { NavLink } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import React from "react";

export interface SidebarOptionProps {
  to: LinkProps["to"];
  children: React.ReactNode;
}

export function SidebarOption({ to, children }: SidebarOptionProps) {
  const activeClasses = "bg-teal-600 text-white shadow-lg";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100";

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center w-full px-6 py-4 transition-colors duration-200
        font-semibold text-left
        ${isActive ? activeClasses : inactiveClasses}
      `
      }
    >
      {children}
    </NavLink>
  );
}
