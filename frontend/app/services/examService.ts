import { api } from "./api";
import type { ExamResponse } from "~/types/exam/examResponse";
import type { ExamResultResponse } from "~/types/exam/examResultResponse";
import type { ConclusionResponse } from "~/types/exam/conclusionResponse";

export async function getExamsByDoctor(doctorId: number) {
  return api.get<ExamResponse[]>(`/exams/doctor/${doctorId}`);
}

export async function getExamsByPatient(patientId: number) {
  return api.get<ExamResponse[]>(`/exams/patient/${patientId}`);
}

export async function getExamById(examId: number) {
  return api.get<ExamResponse>(`/exams/${examId}`);
}

export async function getExamResults(examId: number) {
  return api.get<ExamResultResponse[]>(`/exams/${examId}/results`);
}

export async function getExamConclusions(examId: number) {
  return api.get<ConclusionResponse[]>(`/conclusions/exam/${examId}`);
}

export async function getAllExamStatus() {
  return api.get<{ id: string; description: string }[]>("/exams/status");
}

export async function changeExamStatus(examId: string, statusId: string) {
  return api.put<ExamResponse>(`/exams/${examId}/status`, { status: statusId });
}
