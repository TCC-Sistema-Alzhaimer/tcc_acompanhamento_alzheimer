import { ConclusionResponse } from "@/types/api/conclusion";
import { NotificationResponse } from "@/types/api/notification";
import { Notification } from "@/types/domain/notification";
import { DocumentPickerAsset } from "expo-document-picker";

export function parseNotification(data: NotificationResponse): Notification {
  return {
    id: data.notificationId,
    recipientId: data.recipientid,
    title: data.title,
    message: data.message,
    sender: data.sender,
    read: data.read,
    examId: data.examId ?? null,
    associationId: data.associationId ?? null,
    createdAt: data.createdAt,
  };
}

export function appendAssetToFormData(
  formData: FormData,
  asset: DocumentPickerAsset
) {
  if (asset.file instanceof File) {
    formData.append("files", asset.file);
  } else {
    formData.append("files", {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType ?? "application/octet-stream",
    } as any);
  }
}

export function perserConclusion(
  conclusion: ConclusionResponse
): ConclusionResponse {
  return {
    ...conclusion,
    id: conclusion.id != null ? String(conclusion.id) : "",
    examId: conclusion.examId != null ? String(conclusion.examId) : "",
    doctorId: conclusion.doctorId != null ? String(conclusion.doctorId) : "",
    createdAt: conclusion.createdAt ?? "",
    updatedAt: conclusion.updatedAt ?? undefined,
    updatedBy:
      conclusion.updatedBy !== undefined && conclusion.updatedBy !== null
        ? String(conclusion.updatedBy)
        : undefined,
    files: conclusion.files ?? [],
  };
}
