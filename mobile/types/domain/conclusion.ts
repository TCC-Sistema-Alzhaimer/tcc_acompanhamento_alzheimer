import { FileInfoDTO } from "./files";

export interface Conclusion {
  id: string;
  examId: string;
  doctorId: string;
  description: string;
  notes?: string;
  conclusion: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
  files: FileInfoDTO[];
}
