import type { ExamResponse } from "~/types/exam/examResponse";
import { api } from "./api";
import type { PatientModel } from "~/types/roles/models";
import type { ExamType } from "~/types/exam/examType";

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

export const getPatientExams = async (patientId: number) => {
  try {
    const response = await api.get<ExamResponse[]>(
      `/exams/patient/${patientId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar exames do paciente:", error);
    throw error;
  }
};

export const getExamTypes = async () => {
  try {
    const response = await api.get<ExamType[]>("/exams/types");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tipos de exame no service:", error);
    throw error;
  }
};
