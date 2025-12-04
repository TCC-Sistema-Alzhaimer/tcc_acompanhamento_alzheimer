import { Exam, HistoricExam } from "../domain/exam";

export interface ExamRequest extends Exam {}

export interface ExamResponse extends Exam {}

export interface AttachmentedFileResponse {
  id: number;
  fileId: number;
  fileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  formattedFileSize: string;
  downloadLink: string;
  isImage: boolean;
  isPdf: boolean;
  uploadDate: string;
  isActive: boolean;
}
export interface HistoricExamResponse extends HistoricExam {
  patientId: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
