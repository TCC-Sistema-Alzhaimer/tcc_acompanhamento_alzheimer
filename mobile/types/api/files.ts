export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  message: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: number;
}

export interface FileInfo {
  id: string;
  name: string;
  mimeType?: string;
  size?: number;
  formattedSize?: string;
  downloadLink?: string;
  fileType?: string;
  isImage?: boolean;
  isPdf?: boolean;
}
