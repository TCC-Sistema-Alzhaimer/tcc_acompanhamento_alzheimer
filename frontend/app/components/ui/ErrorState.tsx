import { RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Erro ao carregar dados",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-700">
      <p className="text-red-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
        >
          <RefreshCcw size={16} />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
