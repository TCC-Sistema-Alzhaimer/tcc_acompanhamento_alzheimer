import React from "react";
import { Trash2, X } from "lucide-react";
import type { IndicatorResponse } from "~/types/dashboard/IndicatorResponse";
import { deleteIndicator } from "~/services/doctorService";

interface IndicatorManagerProps {
  title: string;
  data: IndicatorResponse[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function IndicatorManager({
  title,
  data,
  isOpen,
  onClose,
  onRefresh,
}: IndicatorManagerProps) {
  if (!isOpen) return null;

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja remover este registro?")) {
      try {
        await deleteIndicator(id);
        onRefresh();
      } catch (error) {
        alert("Erro ao remover.");
      }
    }
  };

  const listData = [...data].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Gerenciar: {title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-800" />
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {listData.length === 0 ? (
            <p className="text-center text-gray-700 py-4">
              Nenhum registro encontrado.
            </p>
          ) : (
            listData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
              >
                <div>
                  <span className="block font-bold text-gray-800 text-lg">
                    {item.valor}
                  </span>
                  <span className="text-xs text-gray-700">
                    {new Date(item.data).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(item.data).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {item.descricao && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      "{item.descricao}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remover"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <p className="text-xs text-center text-gray-800">
            Para editar, remova o registro e adicione novamente.
          </p>
        </div>
      </div>
    </div>
  );
}
