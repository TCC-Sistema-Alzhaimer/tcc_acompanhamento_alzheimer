import { ExamResponse } from "@/types/api/exam";
import { api } from "./api";
import { ROUTES } from "./routes";

export async function fetchExams({
  accessToken,
}: {
  accessToken: string;
}): Promise<ExamResponse[]> {
  const res = await api.get(ROUTES.EXAMS, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}

export async function fetchExamById({
  accessToken,
  examId,
}: {
  accessToken: string;
  examId: string;
}): Promise<ExamResponse> {
  const res = await api.get(ROUTES.EXAM_BY_ID(examId), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}

export async function fetchExamsByPatientId({
  accessToken,
  patientId,
}: {
  accessToken: string;
  patientId: string;
}): Promise<ExamResponse[]> {
  const res = await api.get(ROUTES.EXAM_BY_PATIENT_ID(patientId), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}
