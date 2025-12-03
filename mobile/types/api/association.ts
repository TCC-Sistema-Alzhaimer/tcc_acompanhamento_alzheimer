import { RequestStatus } from "../enum/exam-status";

export type AssociationType =
  | "PATIENT_TO_DOCTOR"
  | "PATIENT_TO_CAREGIVER"
  | "CAREGIVER_TO_PATIENT"
  | "DOCTOR_TO_PATIENT";

export interface AssociationResponseDto {
  id: number;
  patient: AssociationParticipantDto;
  relation: AssociationParticipantDto;
  type: AssociationType;
  status: string;
  createdAt: string;
  respondedAt?: string | null;
  creatorEmail: string;
  responderEmail?: string | null;
}

export interface AssociationParticipantDto {
  id: number;
  name: string;
  email: string;
  userType: string;
}

export interface AssociationRequestDto {
  accessToken: string;
  associationId?: number;
  responderEmail: string;
  status: RequestStatus;
}
