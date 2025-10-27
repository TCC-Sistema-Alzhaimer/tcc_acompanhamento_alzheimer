import { api } from "./api";
import type { AssociationRequestResponseDto } from "~/types/association/AssociationRequestResponseDto";
import type { RequestStatus } from "~/types/association/RequestStatus";
import type { RequestType } from "~/types/association/RequestType";

export const getAllRequests = async (): Promise<AssociationRequestResponseDto[]> => {
  const response = await api.get("/requests");
  return response.data;
};

export const getRequestById = async (id: number): Promise<AssociationRequestResponseDto> => {
  const response = await api.get(`/requests/${id}`);
  return response.data;
};

export const respondToRequest = async (
  id: number,
  payload: { responderEmail: string; status: RequestStatus }
): Promise<AssociationRequestResponseDto> => {
  const response = await api.post(`/requests/${id}/respond`, payload);
  return response.data;
};

export const createRequest = async (payload: { creatorEmail: string, patientEmail: string, relationEmail: string, type: RequestType }) => {
    console.log("Creating request with payload:", payload);
    const res = await api.post('/requests', payload);
    return res.data;
};
