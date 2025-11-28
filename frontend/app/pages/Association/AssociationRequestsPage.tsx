import { useState, useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { getAllRequests } from "~/services/associationService";
import { AssociationRequestList } from "~/components/association/AssociationRequestList";
import { AssociationRequestForm } from "~/components/association/AssociationRequestForm";
import type { AssociationRequestResponseDto } from "~/types/association/AssociationRequestResponseDto";
import type { RequestStatus } from "~/types/association/RequestStatus";

export function AssociationRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AssociationRequestResponseDto[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<AssociationRequestResponseDto | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "">("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <main className="grid h-full overflow-hidden gap-6 lg:grid-cols-[360px_1fr]">
      <AssociationRequestList
        requests={requests}
        selectedRequest={selectedRequest}
        setSelectedRequest={setSelectedRequest}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
      />

      <div className="h-full overflow-y-auto flex flex-col gap-6">
        <AssociationRequestForm
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
          fetchRequests={fetchRequests}
          user={user}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </main>
  );
}

export default AssociationRequests;
