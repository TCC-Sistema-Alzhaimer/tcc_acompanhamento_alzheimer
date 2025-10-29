import Select from "react-select";
import Button from "~/components/Button";
import Input from "~/components/Input";
import type { AssociationRequestResponseDto } from "~/types/association/AssociationRequestResponseDto";
import type { RequestStatus } from "~/types/association/RequestStatus";

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
    idFilter: string;
    setIdFilter: (id: string) => void;
}

export function AssociationRequestList({
    requests,
    selectedRequest,
    setSelectedRequest,
    statusFilter,
    setStatusFilter,
    idFilter,
    setIdFilter
}: Props) {

    const filteredRequests = requests.filter(r =>
        (!statusFilter || r.status === statusFilter) &&
        (!idFilter || r.id.toString() === idFilter)
    );

    return (
        <div className="w-1/3 bg-white rounded-2xl shadow p-3 flex flex-col gap-2">
            <h2 className="text-lg font-bold">Solicitações</h2>
            <Button
                onClick={() => setSelectedRequest(null)}
                className="w-full py-3 text-lg font-semibold"
            >
                + Nova Solicitação
            </Button>

            <Input
                placeholder="Filtrar por ID"
                value={idFilter}
                onChange={(e) => setIdFilter(e.target.value)}
            >
                ID
            </Input>

            <Select
                options={statusOptions}
                value={statusOptions.find(o => o.value === statusFilter)}
                onChange={(selected) => setStatusFilter(selected?.value || "")}
            />

            <div className="overflow-y-auto mt-2 flex-1">
                {filteredRequests.map(r => (
                    <div
                        key={r.id}
                        onClick={() => setSelectedRequest(r)}
                        className={`p-2 rounded cursor-pointer ${selectedRequest?.id === r.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
                    >
                        <div><strong>ID:</strong> {r.id}</div>
                        <div><strong>Status:</strong> {r.status}</div>
                        <div><strong>Paciente:</strong> {r.patient.email}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
