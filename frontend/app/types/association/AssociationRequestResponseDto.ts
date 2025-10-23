import type { RequestStatus } from "./RequestStatus";

export type AssociationRequestResponseDto = {
  id: number;
  patientEmail: string;
  relationEmail: string;
  type: string;
  status: RequestStatus;
  createdAt: string;
  respondedAt?: string;
  creatorEmail: string;
  responderEmail?: string;
};