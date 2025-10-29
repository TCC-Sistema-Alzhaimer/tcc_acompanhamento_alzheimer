export interface FileInfo {
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

export interface MedicalHistoryResponse {
  id: number;
  patientId: number;
  description: string;
  createdAt: string;
  createdBy: number | null;
  updatedAt: string | null;
  updatedBy: number | null;
  files: FileInfo[];
}
