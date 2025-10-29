import { useState } from "react";
import Select from "react-select";
import Button from "~/components/Button";
import { UserSelect } from "~/components/UserSelect/UserSelect";
import type { AssociationRequestResponseDto } from "~/types/association/AssociationRequestResponseDto";
import { SystemRoles } from "~/types/SystemRoles";
import type { RequestType } from "~/types/association/RequestType";
import type { RequestStatus } from "~/types/association/RequestStatus";
import { respondToRequest, createRequest } from "~/services/associationService";

const requestTypeOptions = [
    { value: "PATIENT_TO_DOCTOR" as RequestType, label: "Paciente → Médico" },
    { value: "PATIENT_TO_CAREGIVER" as RequestType, label: "Paciente → Cuidador" },
    { value: "DOCTOR_TO_PATIENT" as RequestType, label: "Médico → Paciente" },
    { value: "CAREGIVER_TO_PATIENT" as RequestType, label: "Cuidador → Paciente" },
];

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
            if (userRole === SystemRoles.CAREGIVER) return SystemRoles.CAREGIVER;
        default: return SystemRoles.DOCTOR;
    }
}

interface Props {
    selectedRequest: AssociationRequestResponseDto | null;
    setSelectedRequest: (req: AssociationRequestResponseDto | null) => void;
    fetchRequests: () => void;
    user: any;
    errorMessage: string | null;
    setErrorMessage: (msg: string | null) => void;
    setShowSuccessModal: (open: boolean) => void;
}

export function AssociationRequestForm({
    selectedRequest,
    setSelectedRequest,
    fetchRequests,
    user,
    errorMessage,
    setErrorMessage,
    setShowSuccessModal
}: Props) {
    const userRole = user?.role ?? "";
    const allowedValues = roleOptionsMap[userRole] || [];
    const filteredOptions = requestTypeOptions.filter(opt => allowedValues.includes(opt.value));

    const [newPatientEmail, setNewPatientEmail] = useState(userRole === "PATIENT" ? user?.email || "" : "");
    const [newRelationEmail, setNewRelationEmail] = useState(userRole === "CAREGIVER" ? user?.email || "" : "");
    const [newType, setNewType] = useState<RequestType | "">("");

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
            setErrorMessage(err.response?.data?.message || "Erro ao responder solicitação.");
        }
    };

    const handleCreateRequest = async () => {
        setErrorMessage(null);
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
            setErrorMessage(err.response?.data?.message || "Erro ao criar solicitação.");
        }
    };

    if (selectedRequest) {
        const { patient, relation, type, status, createdAt, respondedAt, creatorEmail, responderEmail } = selectedRequest;

        const formatUserType = (userType: string) => {
            switch (userType) {
                case "DOCTOR": return "Médico";
                case "PATIENT": return "Paciente";
                case "CAREGIVER": return "Cuidador";
                default: return userType;
            }
        };

        const formatRequestType = (type: string) => {
            switch (type) {
                case "PATIENT_TO_DOCTOR": return "Paciente → Médico";
                case "PATIENT_TO_CAREGIVER": return "Paciente → Cuidador";
                case "DOCTOR_TO_PATIENT": return "Médico → Paciente";
                case "CAREGIVER_TO_PATIENT": return "Cuidador → Paciente";
                default: return type;
            }
        };

        return (
            <div className="flex-1 bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-2">Detalhes da Solicitação</h2>

                <div><strong>ID:</strong> {selectedRequest.id}</div>

                <div>
                    <strong>Paciente:</strong> {patient.name} ({patient.email}) - {formatUserType(patient.userType)}
                </div>

                <div>
                    <strong>Relação:</strong> {relation.name} ({relation.email}) - {formatUserType(relation.userType)}
                </div>

                <div><strong>Tipo:</strong> {formatRequestType(type)}</div>
                <div><strong>Status:</strong> {status}</div>
                <div><strong>Criado por:</strong> {creatorEmail}</div>
                <div><strong>Respondido por:</strong> {responderEmail || "-"}</div>
                <div><strong>Criado em:</strong> {new Date(createdAt).toLocaleString()}</div>
                {respondedAt && (
                    <div><strong>Respondido em:</strong> {new Date(respondedAt).toLocaleString()}</div>
                )}

                {status === "PENDENTE" && (
                    <div className="flex gap-3 mt-4">
                        <Button onClick={() => handleRespond("ACEITA")}>Aceitar</Button>
                        <Button onClick={() => handleRespond("REJEITADA")} variant="danger">Rejeitar</Button>
                    </div>
                )}

                {errorMessage && (
                    <div className="w-full p-3 bg-red-100 text-red-700 rounded">
                        {errorMessage}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white rounded-2xl shadow p-3 flex flex-col gap-3">
            <h2 className="text-xl font-bold">Nova Solicitação</h2>

            <Select
                options={filteredOptions}
                placeholder="Tipo de solicitação"
                value={filteredOptions.find(o => o.value === newType) || null}
                onChange={(selected) => setNewType(selected?.value || "")}
            />

            <UserSelect
                role={SystemRoles.PATIENT}
                value={userRole === "PATIENT" ? user.email : newPatientEmail}
                onChange={setNewPatientEmail}
                isDisabled={!newType || userRole === "PATIENT"}
            />

            <UserSelect
                role={getSecondSelectRole(newType, "CAREIGVER" as SystemRoles)}
                value={userRole === "CAREGIVER" && newType === "CAREGIVER_TO_PATIENT" ? user.email : newRelationEmail}
                onChange={setNewRelationEmail}
                isDisabled={!newType || (userRole === "CAREGIVER" && newType === "CAREGIVER_TO_PATIENT")}
            />

            {errorMessage && <div className="p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>}

            <Button onClick={handleCreateRequest}>Criar Solicitação</Button>
        </div>
    );
}
