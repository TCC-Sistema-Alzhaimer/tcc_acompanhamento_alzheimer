import { ExamStatus } from "../enum/exam-status";
import { FileInfoDTO } from "./files";

export enum ExamType {
  BLOOD_TEST = "BLOOD_TEST",
  URINE_TEST = "URINE_TEST",
  BRAIN_SCAN = "BRAIN_SCAN",
  COGNITIVE_ASSESSMENT = "COGNITIVE_ASSESSMENT",
  OTHER = "OTHER",
}

export interface Exam {
  id?: string;
  doctorId: string;
  doctorName?: string;
  patientId: string;
  patientName?: string;
  examTypeId: ExamType;
  examTypeDescription?: string;
  examStatusId: ExamStatus;
  examStatusDescription?: string;
  requestDate: string;
  instructions?: string;
  result?: string;
  note: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface HistoricExam {
  id: string;
  description: string;
  createdAt: string;
  files: FileInfoDTO[];
}
