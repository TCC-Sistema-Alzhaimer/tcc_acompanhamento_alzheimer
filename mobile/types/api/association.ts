export interface AssociationResponseDto {
  id: number;
  patient: AssociationParticipantDto;
  relation: AssociationParticipantDto;
  type: string;
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
