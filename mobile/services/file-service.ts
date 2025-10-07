import { Platform } from "react-native";

import { FileUploadResponse } from "@/types/api/files";

import { guessMime } from "@/util/guess-mime";
import { api } from "./api";
import { ROUTES } from "./routes";

export type UploadableFile = {
  uri: string;
  name: string;
  mimeType?: string | null;
};

type UploadExamAttachmentParams = {
  accessToken: string;
  examId: string;
  file: UploadableFile;
};

async function appendFile(formData: FormData, file: UploadableFile) {
  if (Platform.OS === "web") {
    const res = await fetch(file.uri);
    const blob = await res.blob();
    const webFile = new File([blob], file.name, {
      type: file.mimeType ?? blob.type ?? guessMime(file.name),
    });
    formData.append("file", webFile);
    return;
  }

  formData.append("file", {
    uri: file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`,
    name: file.name,
    type: file.mimeType ?? guessMime(file.name),
  } as any);
}

export async function uploadExamAttachment({
  accessToken,
  examId,
  file,
}: UploadExamAttachmentParams): Promise<FileUploadResponse> {
  const formData = new FormData();
  await appendFile(formData, file);

  const response = await api.post<FileUploadResponse>(
    ROUTES.EXAM_ATTACHMENTS(examId),
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      transformRequest: (data) => data,
    }
  );

  return response.data;
}
