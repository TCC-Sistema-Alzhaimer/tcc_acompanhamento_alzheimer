import { useState, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { getAllRequests } from "~/services/associationService";
import { AssociationRequestList } from "~/components/association/AssociationRequestList";
import { AssociationRequestForm } from "~/components/association/AssociationRequestForm";
import Modal from "~/components/modals/ModalSucess";
import type { AssociationRequestResponseDto } from "~/types/association/AssociationRequestResponseDto";
import type { RequestStatus } from "~/types/association/RequestStatus";

export function AssociationRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<AssociationRequestResponseDto[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<AssociationRequestResponseDto | null>(null);
    const [statusFilter, setStatusFilter] = useState<RequestStatus | "">("");
    const [idFilter, setIdFilter] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const fetchRequests = async () => {
        try {
            const res = await getAllRequests();
            setRequests(res);
        } catch (err) {
            console.error(err);
            setErrorMessage("Erro ao buscar solicitações.");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="flex gap-4 w-full h-full p-3">
            <AssociationRequestList
                requests={requests}
                selectedRequest={selectedRequest}
                setSelectedRequest={setSelectedRequest}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                idFilter={idFilter}
                setIdFilter={setIdFilter}
            />

            <AssociationRequestForm
                selectedRequest={selectedRequest}
                setSelectedRequest={setSelectedRequest}
                fetchRequests={fetchRequests}
                user={user}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                setShowSuccessModal={setShowSuccessModal}
            />

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