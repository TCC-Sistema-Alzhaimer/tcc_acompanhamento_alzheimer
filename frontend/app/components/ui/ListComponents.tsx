import { RefreshCcw } from "lucide-react";
import type { ReactNode } from "react";

interface ListHeaderProps {
  count: number;
  singular: string;
  plural: string;
  onRefresh?: () => void;
}

export function ListHeader({
  count,
  singular,
  plural,
  onRefresh,
}: ListHeaderProps) {
  const label = count === 1 ? singular : plural;
  const suffix = count === 1 ? "" : "s";

  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">
        {count} {label} encontrado{suffix}
      </span>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
        >
          <RefreshCcw size={14} />
          Atualizar
        </button>
      )}
    </div>
  );
}

interface ListContainerProps {
  children: ReactNode;
  className?: string;
}

export function ListContainer({
  children,
  className = "",
}: ListContainerProps) {
  return <div className={`flex flex-col gap-2 ${className}`}>{children}</div>;
}

interface ListContentProps {
  children: ReactNode;
  maxHeight?: string;
}

export function ListContent({
  children,
  maxHeight = "500px",
}: ListContentProps) {
  return (
    <div className="space-y-2" style={{ maxHeight, overflowY: "auto" }}>
      {children}
    </div>
  );
}
