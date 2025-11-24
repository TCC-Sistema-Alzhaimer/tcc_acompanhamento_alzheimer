import { Exam, HistoricExam } from "../domain/exam";

export interface ExamRequest extends Exam {}

export interface ExamResponse extends Exam {}

export interface HistoricExamResponse extends HistoricExam {
  patientId: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
