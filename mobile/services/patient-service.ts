import { PatientResponse } from "@/types/api/patient";
import { api } from "./api";
import { ROUTES } from "./routes";

interface FetchPatientsParams {
  accessToken: string;
}

export async function fetchPatients({
  accessToken,
}: FetchPatientsParams): Promise<PatientResponse[]> {
  const resp = await api.get<PatientResponse[]>(ROUTES.PATIENTS, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return resp.data;
}
