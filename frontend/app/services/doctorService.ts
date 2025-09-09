import { api } from "./api";
import type { BasicListModel } from "~/types/roles/models";

export function getPatientsByDoctor(doctorId: number, query?: string, serviceType?: string) {
  const params: any = {};
  if (query) params.query = query;
  if (serviceType) params.serviceType = serviceType;

  return api.get<BasicListModel[]>(`/doctors/${doctorId}/patients`, { params });
}