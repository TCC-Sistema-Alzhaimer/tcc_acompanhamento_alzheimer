import React from "react";
import { LineChart } from "lucide-react";
import type { IndicatorResponse } from "~/types/dashboard/IndicatorResponse";

interface BioindicatorChartProps {
  title: string;
  data: IndicatorResponse[];
  isLoading: boolean;
}

export function BioindicatorChart({
  title,
  data,
  isLoading,
}: BioindicatorChartProps) {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      <div className="flex items-center justify-center h-32 text-gray-300">
        {isLoading && <p className="text-xs text-gray-500">Carregando...</p>}

        {!isLoading && hasData && (
          <LineChart size={48} className="text-teal-500" />
        )}

        {!isLoading && !hasData && (
          <p className="text-xs text-gray-400">Sem dados</p>
        )}
      </div>
    </div>
  );
}
