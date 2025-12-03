import { type ReactNode } from "react";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface TabPanelProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
}

export function TabPanel({
  tabs,
  activeTab,
  onTabChange,
  children,
}: TabPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer",
                activeTab === tab.id
                  ? "text-teal-600 border-teal-600"
                  : "text-gray-700 border-transparent hover:text-gray-900 hover:border-gray-300"
              )}
            >
              {Icon && <Icon size={18} />}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}
