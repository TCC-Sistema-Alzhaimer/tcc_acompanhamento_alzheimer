import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-700">
      <Icon className="w-12 h-12 mb-4 text-gray-400" />
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
}
