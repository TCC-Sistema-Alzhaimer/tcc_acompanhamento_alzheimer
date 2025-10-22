import { api } from "./api";
import type { PatientModel } from "~/types/roles/models";

export const getPatientsByDoctor = async (doctorId: number, query: string) => {
  try {
    const response = await api.get<PatientModel[]>(
      `/doctors/${doctorId}/patients`,
      {
        params: {
          query: query,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pacientes no service:", error);
    throw error;
  }
};

export const getPatientDetails = async (patientId: number) => {
  try {
    const response = await api.get(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do paciente:", error);
    throw error;
  }
};
