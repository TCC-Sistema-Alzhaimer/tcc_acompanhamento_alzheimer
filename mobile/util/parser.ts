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
