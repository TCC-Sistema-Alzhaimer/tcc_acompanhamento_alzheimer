export interface FileInfoDTO {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  formattedSize: string;
  createdTime: string | Date;
  modifiedTime: string | Date;
  downloadLink?: string;
  fileType: string;
  isImage: boolean;
  isPdf: boolean;
}
