import { PatientResponse } from "@/types/api/patient";
import { api } from "./api";
import { ROUTES } from "./routes";

interface RequestParams {
  caregiverId?: string;
  accessToken: string;
}

export async function fetchPatientsByCaregiver({
  caregiverId,
  accessToken,
}: RequestParams): Promise<PatientResponse[]> {
  const resp = await api.get(ROUTES.CAREGIVER_PATIENTS(caregiverId!), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return resp.data;
}
