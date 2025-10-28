import { associationListMock } from "@/mocks/association-mock";
import { AssociationResponseDto } from "@/types/api/association";

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
    const response = await new Promise<AssociationResponseDto[]>((resolve) => {
      setTimeout(() => {
        resolve(
          associationListMock.filter((association) =>
            patientId ? association.patient.id === Number(patientId) : true
          )
        );
      }, 500);
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch associations");
  }
}

export async function fetchAssociationById({
  accessToken,
  associationId,
}: FetchAssociationsParams): Promise<AssociationResponseDto | null> {
  try {
    const response = await new Promise<AssociationResponseDto | null>(
      (resolve) => {
        setTimeout(() => {
          const association = associationListMock.find(
            (assoc) => assoc.id === Number(associationId)
          );
          resolve(association || null);
        }, 500);
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch association by ID");
  }
}
