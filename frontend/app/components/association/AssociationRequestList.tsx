import { useState } from "react";
import Select from "react-select";
import Button from "~/components/Button";
import Input from "~/components/Input";
import type { AssociationRequestResponseDto } from "~/types/association/AssociationRequestResponseDto";
import type { RequestStatus } from "~/types/association/RequestStatus";
import { ChevronDown, ChevronUp } from "lucide-react";

const statusOptions = [
  { value: "PENDENTE" as RequestStatus, label: "Pendente" },
  { value: "ACEITA" as RequestStatus, label: "Aceita" },
  { value: "REJEITADA" as RequestStatus, label: "Rejeitada" },
];

interface Props {
  requests: AssociationRequestResponseDto[];
  selectedRequest: AssociationRequestResponseDto | null;
  setSelectedRequest: (req: AssociationRequestResponseDto | null) => void;
  statusFilter: RequestStatus | "";
  setStatusFilter: (status: RequestStatus | "") => void;
  nameFilter: string;
  setNameFilter: (name: string) => void;
}

export function AssociationRequestList({
  requests,
  selectedRequest,
  setSelectedRequest,
  statusFilter,
  setStatusFilter,
  nameFilter,
  setNameFilter,
}: Props) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const filteredRequests = requests.filter((r) => {
    const nameMatch =
      !nameFilter ||
      r.patient.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
      r.relation.name.toLowerCase().includes(nameFilter.toLowerCase());
    return (!statusFilter || r.status === statusFilter) && nameMatch;
  });

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-base font-semibold text-gray-800">Solicitações</h2>
      </div>

      <div className="border-b border-gray-100 shrink-0">
        <div className="p-4 flex flex-col gap-3">
          <Button onClick={() => setSelectedRequest(null)} variant="dashed">
            + Nova Solicitação
          </Button>
        </div>

        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="w-full px-4 py-2 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          <span>Filtros</span>
          <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-100">
            {filtersExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </button>

        {filtersExpanded && (
          <div className="px-4 pb-4 flex flex-col gap-3">
            <Input
              placeholder="Buscar por nome"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            ></Input>

            <Select
              options={statusOptions}
              value={statusOptions.find((o) => o.value === statusFilter)}
              onChange={(selected) => setStatusFilter(selected?.value || "")}
              placeholder="Filtrar por status"
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  minHeight: "38px",
                  fontSize: "14px",
                }),
              }}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {filteredRequests.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedRequest(r)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedRequest?.id === r.id
                  ? "border-teal-400 bg-teal-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {r.patient.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    {r.relation.userType === "CAREGIVER"
                      ? "Cuidador"
                      : "Médico"}
                    : {r.relation.name}
                  </div>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                    r.status === "PENDENTE"
                      ? "bg-amber-100 text-amber-700"
                      : r.status === "ACEITA"
                        ? "bg-teal-100 text-teal-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-gray-600">
              <p className="text-sm font-semibold">
                Nenhuma solicitação encontrada
              </p>
              <p className="text-xs">Tente ajustar os filtros.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
