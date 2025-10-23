import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Modal from "~/components/modals/ModalSucess";
import type { RequestType } from "~/types/association/RequestType";
import { UserSelect } from "~/components/UserSelect/UserSelect";
import { SystemRoles } from "~/types/SystemRoles";
import { useAuth } from "~/hooks/useAuth";
import {
    getAllRequests,
    respondToRequest,
    createRequest,
} from "~/services/associationService";
import type { AssociationRequestResponseDto } from "~/types/association/AssociationRequestResponseDto";
import type { RequestStatus } from "~/types/association/RequestStatus";

const statusOptions = [
    { value: "PENDENTE" as RequestStatus, label: "Pendente" },
    { value: "ACEITA" as RequestStatus, label: "Aceita" },
    { value: "REJEITADA" as RequestStatus, label: "Rejeitada" },
];

const requestTypeOptions = [
    { value: "PATIENT_TO_DOCTOR" as RequestType, label: "Paciente → Médico" },
    { value: "PATIENT_TO_CAREGIVER" as RequestType, label: "Paciente → Cuidador" },
    { value: "DOCTOR_TO_PATIENT" as RequestType, label: "Médico → Paciente" },
    { value: "CAREGIVER_TO_PATIENT" as RequestType, label: "Cuidador → Paciente" },
];

export function AssociationRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<AssociationRequestResponseDto[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<AssociationRequestResponseDto | null>(null);
    const [statusFilter, setStatusFilter] = useState<RequestStatus | "">("");
    const [idFilter, setIdFilter] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // Campos para nova solicitação
    const [newPatientEmail, setNewPatientEmail] = useState("");
    const [newRelationEmail, setNewRelationEmail] = useState("");
    const [newType, setNewType] = useState<RequestType | "">("");

    const fetchRequests = async () => {
        try {
            const res = await getAllRequests();
            setRequests(res);
        } catch (err) {
            console.error(err);
            setErrorMessage("Erro ao buscar solicitações.");
        }
    };

    const roleOptionsMap: Record<string, RequestType[]> = {
        PATIENT: ["PATIENT_TO_DOCTOR", "PATIENT_TO_CAREGIVER"],
        DOCTOR: ["PATIENT_TO_CAREGIVER", "DOCTOR_TO_PATIENT"],
        CAREGIVER: ["CAREGIVER_TO_PATIENT", "PATIENT_TO_DOCTOR"],
        ADMIN: ["PATIENT_TO_DOCTOR", "PATIENT_TO_CAREGIVER", "DOCTOR_TO_PATIENT"],
    };

    function getSecondSelectRole(newType: RequestType | "", userRole: SystemRoles | ""): SystemRoles {
        if (!newType) return SystemRoles.DOCTOR;
        switch (newType) {
            case "PATIENT_TO_DOCTOR": return SystemRoles.DOCTOR;
            case "PATIENT_TO_CAREGIVER": return SystemRoles.CAREGIVER;
            case "DOCTOR_TO_PATIENT": return SystemRoles.DOCTOR;
            case "CAREGIVER_TO_PATIENT": 
                if(userRole === SystemRoles.CAREGIVER) return SystemRoles.CAREGIVER;
            default: return SystemRoles.DOCTOR;
        }
    }

    const userRole = user?.role ?? "";

    const allowedValues = roleOptionsMap[userRole] || [];
    const filteredOptions = requestTypeOptions.filter(opt =>
        allowedValues.includes(opt.value)
    );

    useEffect(() => {
        fetchRequests();
        if (userRole === SystemRoles.PATIENT) {
            setNewPatientEmail(user?.email || "");
        } else if (userRole === SystemRoles.CAREGIVER) {
            setNewRelationEmail(user?.email || "");
        }
    }, []);

    // Filtrar solicitações
    const filteredRequests = requests.filter(r => {
        return (!statusFilter || r.status === statusFilter) &&
            (!idFilter || r.id.toString() === idFilter);
    });

    // Responder solicitação existente
    const handleRespond = async (status: RequestStatus) => {
        if (!selectedRequest) return;
        setErrorMessage(null);

        try {
            await respondToRequest(selectedRequest.id, {
                responderEmail: user?.email!,
                status
            });
            setShowSuccessModal(true);
            fetchRequests();
            setSelectedRequest(null);
        } catch (err: any) {
            console.error(err);
            if (err.response?.data?.message) setErrorMessage(err.response.data.message);
            else setErrorMessage("Erro ao responder solicitação.");
        }
    };

    // Criar nova solicitação
    const handleCreateRequest = async () => {
        setErrorMessage(null);
        console.log({ newPatientEmail, newRelationEmail, newType });
        try {
            await createRequest({
                creatorEmail: user?.email!,
                patientEmail: newPatientEmail,
                relationEmail: newRelationEmail,
                type: newType as RequestType,
            });
            setShowSuccessModal(true);
            setNewPatientEmail("");
            setNewRelationEmail("");
            setNewType("");
            fetchRequests();
        } catch (err: any) {
            console.error(err);
            if (err.response?.data?.message) setErrorMessage(err.response.data.message);
            else setErrorMessage("Erro ao criar solicitação.");
        }
    };

    return (
        <div className="flex gap-4 w-full h-full p-3">
            {/* Lista lateral */}
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
                            className={`p-2 rounded cursor-pointer ${selectedRequest?.id === r.id ? "bg-blue-100" : "hover:bg-gray-100"
                                }`}
                        >
                            <div><strong>ID:</strong> {r.id}</div>
                            <div><strong>Status:</strong> {r.status}</div>
                            <div><strong>Paciente:</strong> {r.patientEmail}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Formulário principal */}
            <div className="flex-1 bg-white rounded-2xl shadow p-3 flex flex-col gap-3">
                {selectedRequest ? (
                    <>
                        <h2 className="text-xl font-bold">Detalhes da Solicitação</h2>

                        <div><strong>ID:</strong> {selectedRequest.id}</div>
                        <div><strong>Paciente:</strong> {selectedRequest.patientEmail}</div>
                        <div><strong>Relação:</strong> {selectedRequest.relationEmail}</div>
                        <div><strong>Tipo:</strong> {selectedRequest.type}</div>
                        <div><strong>Status:</strong> {selectedRequest.status}</div>
                        <div><strong>Criado por:</strong> {selectedRequest.creatorEmail}</div>
                        <div><strong>Respondido por:</strong> {selectedRequest.responderEmail || "-"}</div>
                        <div><strong>Criado em:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</div>
                        {selectedRequest.respondedAt && (
                            <div><strong>Respondido em:</strong> {new Date(selectedRequest.respondedAt).toLocaleString()}</div>
                        )}

                        {selectedRequest.status === "PENDENTE" && (
                            <div className="flex gap-2 mt-3">
                                <Button onClick={() => handleRespond("ACEITA")}>Aceitar</Button>
                                <Button onClick={() => handleRespond("REJEITADA")}>Rejeitar</Button>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="w-full p-2 bg-red-100 text-red-700 rounded">
                                {errorMessage}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold">Nova Solicitação</h2>

                        <Select
                            options={filteredOptions}
                            placeholder="Tipo de solicitação"
                            value={filteredOptions.find(o => o.value === newType) || null}
                            onChange={(selected) => setNewType(selected?.value || "")}
                        />

                        <UserSelect
                            role={SystemRoles.PATIENT}
                            value={user?.role === SystemRoles.PATIENT ? user.email : newPatientEmail}
                            onChange={(email) => setNewPatientEmail(email)}
                            isDisabled={!newType || user?.role === SystemRoles.PATIENT}
                        />

                        <UserSelect
                            role={getSecondSelectRole(newType, SystemRoles.CAREGIVER)}
                            value={user?.role === SystemRoles.CAREGIVER && newType ===  "CAREGIVER_TO_PATIENT" ? user.email : newRelationEmail}
                            onChange={(email) => setNewRelationEmail(email)}
                            isDisabled={!newType || (user?.role === SystemRoles.CAREGIVER && newType === "CAREGIVER_TO_PATIENT")}
                        />

                        {errorMessage && <div className="p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>}

                        <Button onClick={handleCreateRequest}>Criar Solicitação</Button>
                    </>
                )}
            </div>

            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Sucesso!"
            >
                Operação realizada com sucesso.
            </Modal>
        </div>
    );
}

export default AssociationRequests;
