import { AssociationResponseDto } from "../types/api/association";

export const associationResponseMock: AssociationResponseDto = {
  id: 3,
  patient: {
    id: 9,
    name: "Marina Melo",
    email: "marina.melo@alzcare.com",
    userType: "PATIENT",
  },
  relation: {
    id: 5,
    name: "Amanda Legal",
    email: "amanda.dias@alzcare.com",
    userType: "CAREGIVER",
  },
  type: "PATIENT_TO_CAREGIVER",
  status: "ACEITA",
  createdAt: "2025-10-06T00:52:07.323409",
  respondedAt: "2025-10-08T00:52:07.323415",
  creatorEmail: "marina.melo@alzcare.com",
  responderEmail: "admin@alzcare.com",
};

export const associationListMock: AssociationResponseDto[] = [
  associationResponseMock,
  {
    id: 4,
    patient: {
      id: 10,
      name: "Carlos Oliveira",
      email: "carlos.oliveira@alzcare.com",
      userType: "PATIENT",
    },
    relation: {
      id: 6,
      name: "Dr. Felipe Siqueira",
      email: "felipe.siqueira@alzcare.com",
      userType: "DOCTOR",
    },
    type: "PATIENT_TO_DOCTOR",
    status: "PENDENTE",
    createdAt: "2025-10-10T09:15:12.110000",
    respondedAt: null,
    creatorEmail: "carlos.oliveira@alzcare.com",
    responderEmail: null,
  },
  {
    id: 5,
    patient: {
      id: 12,
      name: "Joana Ribeiro",
      email: "joana.ribeiro@alzcare.com",
      userType: "PATIENT",
    },
    relation: {
      id: 7,
      name: "Luiza Campos",
      email: "luiza.campos@alzcare.com",
      userType: "CAREGIVER",
    },
    type: "CAREGIVER_TO_PATIENT",
    status: "RECUSADA",
    createdAt: "2025-09-28T14:22:45.540000",
    respondedAt: "2025-09-29T08:05:01.230000",
    creatorEmail: "luiza.campos@alzcare.com",
    responderEmail: "joana.ribeiro@alzcare.com",
  },
];
