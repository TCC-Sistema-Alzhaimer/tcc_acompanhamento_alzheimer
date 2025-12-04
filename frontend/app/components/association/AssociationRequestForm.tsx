import { useState } from "react";
import Select from "react-select";
import Button from "~/components/Button";
import { UserSelect } from "~/components/UserSelect/UserSelect";
import type { AssociationRequestResponseDto } from "~/types/association/AssociationRequestResponseDto";
import { SystemRoles } from "~/types/SystemRoles";
import type { RequestType } from "~/types/association/RequestType";
import type { RequestStatus } from "~/types/association/RequestStatus";
import { respondToRequest, createRequest } from "~/services/associationService";
import { ArrowLeftRight, Send, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "~/context/ToastContext";

const requestTypeOptions = [
  { value: "PATIENT_TO_DOCTOR" as RequestType, label: "Paciente → Médico" },
  {
    value: "PATIENT_TO_CAREGIVER" as RequestType,
    label: "Paciente → Cuidador",
  },
  { value: "DOCTOR_TO_PATIENT" as RequestType, label: "Médico → Paciente" },
  {
    value: "CAREGIVER_TO_PATIENT" as RequestType,
    label: "Cuidador → Paciente",
  },
];

const roleOptionsMap: Record<string, RequestType[]> = {
  PATIENT: ["PATIENT_TO_DOCTOR", "PATIENT_TO_CAREGIVER"],
  DOCTOR: ["PATIENT_TO_CAREGIVER", "DOCTOR_TO_PATIENT"],
  CAREGIVER: ["CAREGIVER_TO_PATIENT", "PATIENT_TO_DOCTOR"],
  ADMINISTRATOR: ["PATIENT_TO_DOCTOR", "PATIENT_TO_CAREGIVER", "DOCTOR_TO_PATIENT"],
};

function getSecondSelectRole(
  newType: RequestType | "",
  userRole: SystemRoles | ""
): SystemRoles {
  if (!newType) return SystemRoles.DOCTOR;
  switch (newType) {
    case "PATIENT_TO_DOCTOR":
      return SystemRoles.DOCTOR;
    case "PATIENT_TO_CAREGIVER":
      return SystemRoles.CAREGIVER;
    case "DOCTOR_TO_PATIENT":
      return SystemRoles.DOCTOR;
    case "CAREGIVER_TO_PATIENT":
      if (userRole === SystemRoles.CAREGIVER) return SystemRoles.CAREGIVER;
    default:
      return SystemRoles.DOCTOR;
  }
}

interface Props {
  selectedRequest: AssociationRequestResponseDto | null;
  setSelectedRequest: (req: AssociationRequestResponseDto | null) => void;
  fetchRequests: () => void;
  user: any;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export function AssociationRequestForm({
  selectedRequest,
  setSelectedRequest,
  fetchRequests,
  user,
  errorMessage,
  setErrorMessage,
}: Props) {
  const toast = useToast();
  const userRole = user?.role ?? "";
  console.log(userRole);
  const allowedValues = roleOptionsMap[userRole] || [];
  const filteredOptions = requestTypeOptions.filter((opt) =>
    allowedValues.includes(opt.value)
  );

  const [newPatientEmail, setNewPatientEmail] = useState(
    userRole === "PATIENT" ? user?.email || "" : ""
  );
  const [newRelationEmail, setNewRelationEmail] = useState(
    userRole === "CAREGIVER" ? user?.email || "" : ""
  );
  const [newType, setNewType] = useState<RequestType | "">("");

  const handleRespond = async (status: RequestStatus) => {
    if (!selectedRequest) return;
    setErrorMessage(null);
    try {
      await respondToRequest(selectedRequest.id, {
        responderEmail: user?.email!,
        status,
      });
      toast.success(
        status === "ACEITA"
          ? "Solicitação aceita com sucesso!"
          : "Solicitação rejeitada."
      );
      fetchRequests();
      setSelectedRequest(null);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Erro ao responder solicitação."
      );
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
      toast.success("Solicitação criada com sucesso!");
      setNewPatientEmail("");
      setNewRelationEmail("");
      setNewType("");
      fetchRequests();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Erro ao criar solicitação."
      );
    }
  };

  if (selectedRequest) {
    const {
      patient,
      relation,
      type,
      status,
      createdAt,
      respondedAt,
      creatorEmail,
      responderEmail,
    } = selectedRequest;

    const formatUserType = (userType: string) => {
      switch (userType) {
        case "DOCTOR":
          return "Médico";
        case "PATIENT":
          return "Paciente";
        case "CAREGIVER":
          return "Cuidador";
        default:
          return userType;
      }
    };

    const formatRequestType = (type: string) => {
      switch (type) {
        case "PATIENT_TO_DOCTOR":
          return "Paciente → Médico";
        case "PATIENT_TO_CAREGIVER":
          return "Paciente → Cuidador";
        case "DOCTOR_TO_PATIENT":
          return "Médico → Paciente";
        case "CAREGIVER_TO_PATIENT":
          return "Cuidador → Paciente";
        default:
          return type;
      }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Detalhes da Solicitação
        </h3>

        {/* Card de conexão entre pessoas */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-center gap-4">
            {/* Pessoa 1 - Paciente */}
            <div className="flex-1 text-center">
              <div className="font-semibold text-gray-900">{patient.name}</div>
              <div className="text-sm text-gray-600 mt-1">{patient.email}</div>
              <div className="text-xs text-gray-700 mt-1 font-medium">
                {formatUserType(patient.userType)}
              </div>
            </div>

            {/* Ícone de conexão */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100">
              <ArrowLeftRight className="w-5 h-5 text-teal-600" />
            </div>

            {/* Pessoa 2 - Relação */}
            <div className="flex-1 text-center">
              <div className="font-semibold text-gray-900">{relation.name}</div>
              <div className="text-sm text-gray-600 mt-1">{relation.email}</div>
              <div className="text-xs text-gray-700 mt-1 font-medium">
                {formatUserType(relation.userType)}
              </div>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                status === "PENDENTE"
                  ? "bg-amber-100 text-amber-700"
                  : status === "ACEITA"
                    ? "bg-teal-100 text-teal-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Criado por:</span>{" "}
            <span className="text-gray-600">{creatorEmail}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Respondido por:</span>{" "}
            <span className="text-gray-600">{responderEmail || "-"}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Criado em:</span>{" "}
            <span className="text-gray-600">
              {new Date(createdAt).toLocaleString()}
            </span>
          </div>
          {respondedAt && (
            <div className="text-sm">
              <span className="font-semibold text-gray-700">
                Respondido em:
              </span>{" "}
              <span className="text-gray-600">
                {new Date(respondedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {status === "PENDENTE" && (
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => handleRespond("ACEITA")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Aceitar
            </button>
            <button
              onClick={() => handleRespond("REJEITADA")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Rejeitar
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="w-full p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-800">Nova Solicitação</h3>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Tipo de solicitação:
        </label>
        <Select
          options={filteredOptions}
          placeholder="Selecione o tipo"
          value={filteredOptions.find((o) => o.value === newType) || null}
          onChange={(selected) => setNewType(selected?.value || "")}
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

      <UserSelect
        role={SystemRoles.PATIENT}
        value={userRole === "PATIENT" ? user.email : newPatientEmail}
        onChange={setNewPatientEmail}
        isDisabled={!newType || userRole === "PATIENT"}
      />

      <UserSelect
        role={getSecondSelectRole(newType, "CAREIGVER" as SystemRoles)}
        value={
          userRole === "CAREGIVER" && newType === "CAREGIVER_TO_PATIENT"
            ? user.email
            : newRelationEmail
        }
        onChange={setNewRelationEmail}
        isDisabled={
          !newType ||
          (userRole === "CAREGIVER" && newType === "CAREGIVER_TO_PATIENT")
        }
      />

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end mt-2">
        <Button
          onClick={handleCreateRequest}
          className="!w-auto !py-2 !px-4 text-sm flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Criar Solicitação
        </Button>
      </div>
    </div>
  );
}
