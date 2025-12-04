export interface ExamResultResponse {
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
