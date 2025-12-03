import { api } from "./api";

export interface FileInfoDTO {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  formattedSize: string;
  createdTime: string;
  modifiedTime: string;
  downloadLink: string;
  fileType: string;
  isImage: boolean;
  isPdf: boolean;
}

export interface MedicalHistoryResponseDTO {
  id: number;
  patientId: number;
  description: string;
  createdAt: string;
  createdBy: number | null;
  files: FileInfoDTO[];
}

export interface ExamResponseDTO {
  id: number;
  doctorId: number;
  patientId: number;
  examTypeId: string;
  examStatusId: string;
  requestDate: string;
  instructions: string;
  note: string;
  examTypeDescription: string;
  examStatusDescription: string;
  doctorName: string;
  patientName: string;
}

export interface FileInfoDTO {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  formattedSize: string;
  createdTime: string;
  modifiedTime: string;
  downloadLink: string;
  fileType: string;
  isImage: boolean;
  isPdf: boolean;
}

export interface ConclusionResponseDTO {
  id: number;
  examId?: number;
  patientId?: number;
  doctorName: string;
  patientName: string;
  title: string;
  content: string;
  createdAt: string;
  attachmentUrls: string[];
  files?: FileInfoDTO[];
}

export interface IndicatorResponseDTO {
  id: number;
  valor: number;
  descricao: string;
  data: string;
  tipoDescription: string;
  tipoId: number;
  patientId: number;
  patientName: string;
  fileId: number | null;
  conclusionId: number | null;
}

export interface ExamType {
  id: string;
  description: string;
}

export interface BasicDtoForList {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
}

export interface PatientModel {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  gender: string;
  birthdate: string;
}

export const getPatientsByDoctor = async (doctorId: number, query: string) => {
  try {
    const response = await api.get<BasicDtoForList[]>(
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
    const response = await api.get<PatientModel>(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do paciente:", error);
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

export const getPatientHistory = async (patientId: number) => {
  try {
    const response = await api.get<MedicalHistoryResponseDTO[]>(
      `/medical-history/patient/${patientId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar histórico médico:", error);
    throw error;
  }
};

export const getPatientExams = async (patientId: number) => {
  try {
    const response = await api.get<ExamResponseDTO[]>(
      `/exams/patient/${patientId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar exames:", error);
    throw error;
  }
};

export const getPatientConclusions = async (patientId: number) => {
  try {
    const response = await api.get<ConclusionResponseDTO[]>(
      `/conclusions/patient/${patientId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar conclusões:", error);
    throw error;
  }
};

export const getConclusionById = async (conclusionId: number) => {
  try {
    const response = await api.get<ConclusionResponseDTO>(
      `/conclusions/${conclusionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar conclusão:", error);
    throw error;
  }
};

export const getPatientIndicators = async (patientId: number) => {
  try {
    const response = await api.get<IndicatorResponseDTO[]>(
      `/indicator/patient/${patientId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar indicadores:", error);
    throw error;
  }
};
