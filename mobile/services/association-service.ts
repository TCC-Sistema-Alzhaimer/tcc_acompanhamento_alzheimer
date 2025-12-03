import {
  AssociationRequestDto,
  AssociationResponseDto,
} from "@/types/api/association";
import { api } from "./api";
import { ROUTES } from "./routes";

interface FetchAssociationsParams {
  accessToken: string;
  patientId?: string;
  associationId?: string;
}

export async function fetchAssociations({
  accessToken,
  patientId,
}: FetchAssociationsParams): Promise<AssociationResponseDto[]> {
  try {
    const endpoint = ROUTES.ASSOCIATIONS;
    const response = await api.get<AssociationResponseDto[]>(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: patientId ? { patientId } : {},
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch associations");
    }

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch associations");
  }
}

export async function fetchAssociationById({
  accessToken,
  associationId,
}: FetchAssociationsParams): Promise<AssociationResponseDto | null> {
  try {
    const endpoint = ROUTES.ASSOCIATION_BY_ID(associationId!);
    console.log("Fetching association from endpoint:", endpoint);
    const response = await api.get<AssociationResponseDto>(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch association by ID");
    }
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch association by ID");
  }
}

export async function respondToAssociationRequest(
  payload: AssociationRequestDto
): Promise<any> {
  const { responderEmail, status, accessToken, associationId } = payload;
  if (!associationId) {
    throw new Error("Association ID is required to respond to a request");
  }
  try {
    const endpoint = ROUTES.ASSOCIATIONS_RESPOND(associationId.toString());
    const response = await api.post(
      endpoint,
      {
        responderEmail,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to respond to association request");
    }
    return response.data;
  } catch (error) {
    throw new Error("Failed to respond to association request");
  }
}
