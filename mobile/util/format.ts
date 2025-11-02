import { AssociationType } from "@/types/api/association";

export function formatAssociationType(type: AssociationType): string {
  switch (type) {
    case "PATIENT_TO_DOCTOR":
      return "Paciente para Médico";
    case "PATIENT_TO_CAREGIVER":
      return "Paciente para Cuidador";
    case "CAREGIVER_TO_PATIENT":
      return "Cuidador para Paciente";
    default:
      return "Tipo Desconhecido";
  }
}

export function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
}
