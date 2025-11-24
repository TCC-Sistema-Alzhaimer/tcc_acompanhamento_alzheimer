import type { RequestStatus } from "./RequestStatus";

export type AssociationRequestResponseDto = {
    "id": number,
    "patient": {
        "id": number,
        "name": string,
        "email": string,
        "userType": string
    },
    "relation": {
        "id": number,
        "name": string,
        "email": string,
        "userType": string
    },
    "type": string,
    "status": RequestStatus,
    "createdAt": string,
    "respondedAt": string,
    "creatorEmail": string,
    "responderEmail": string
};