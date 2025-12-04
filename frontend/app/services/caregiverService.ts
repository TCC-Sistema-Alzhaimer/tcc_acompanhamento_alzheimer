import { api } from "./api";

export function getPatientsByCaregiver(id: number, search: string = "") {
  return api
    .get(`/caregivers/${id}/patients`, {
      params: { search },
    })
    .then((res) => res.data);
}
