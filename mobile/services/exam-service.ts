import { ExamResponse } from "@/types/api/exam";
import { appendAssetToFormData } from "@/util/parser";
import { DocumentPickerAsset } from "expo-document-picker";
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

export async function uploadHistoricExamAttachment({
  accessToken,
  patientId,
  description,
  file,
}: {
  accessToken: string;
  patientId: string;
  description: string;
  file: DocumentPickerAsset;
}): Promise<ExamResponse> {
  try {
    const endpoint = ROUTES.UPLOAD_HISTORIC_EXAM_ATTACHMENT;
    const formData = new FormData();
    console.log("Preparing to upload historic exam attachment", {
      patientId,
      description,
      file,
    });

    const payload = {
      patientId: Number(patientId),
      description,
    };
    const json = JSON.stringify(payload);
    if (typeof Blob !== "undefined") {
      formData.append("data", new Blob([json], { type: "application/json" }));
    } else {
      formData.append("data", json);
    }
    if (file) {
      appendAssetToFormData(formData, file);
    }

    const response = await api.post<ExamResponse>(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to upload historic exam attachment");
    }
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload historic exam attachment");
  }
}
