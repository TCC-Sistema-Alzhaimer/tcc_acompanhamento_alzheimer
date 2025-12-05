import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Settings, TrendingUp } from "lucide-react";
import type { IndicatorResponse } from "~/types/dashboard/IndicatorResponse";

interface BioindicatorChartProps {
  title: string;
  data: IndicatorResponse[];
  isLoading: boolean;
  color?: string;
  onManage: () => void;
}

export function BioindicatorChart({
  title,
  data,
  isLoading,
  color = "#14b8a6",
  onManage,
}: BioindicatorChartProps) {
  const chartData = React.useMemo(() => {
    if (!data) return [];
    return [...data]
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .map((item, index) => {
        const dateObj = new Date(item.data);
        return {
          ...item,
          i: index,
          axisLabel: dateObj.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
          tooltipLabel: dateObj.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });
  }, [data]);

  const hasData = chartData.length > 0;
  const latestValue = hasData ? chartData[chartData.length - 1].valor : "-";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col h-[300px] shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            {title}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {latestValue}
            </span>
            {hasData && (
              <span className="text-xs text-gray-700">último registro</span>
            )}
          </div>
        </div>
        <button
          onClick={onManage}
          className="p-2 hover:bg-gray-100 rounded-full text-teal-400 hover:text-teal-600 transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="flex-1 w-full min-h-0">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-700 text-sm">
            Carregando...
          </div>
        ) : !hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 text-sm gap-2">
            <TrendingUp size={24} className="opacity-20" />
            Sem dados registrados
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />

              <XAxis
                dataKey="i"
                tickFormatter={(index: string | number) => {
                  const idx =
                    typeof index === "number"
                      ? index
                      : parseInt(String(index), 10);
                  return Number.isFinite(idx) && chartData[idx]
                    ? chartData[idx].axisLabel
                    : "";
                }}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                dy={10}
                interval="preserveStartEnd"
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelFormatter={(index) => {
                  return chartData[index as number]?.tooltipLabel || "";
                }}
                formatter={(value: number) => [value, "Valor"]}
              />

              <Line
                type="monotone"
                dataKey="valor"
                stroke={color}
                strokeWidth={3}
                dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
