export interface ConclusionResponse {
  id: number;
  examId: number;
  doctorId: number;
  doctorName?: string;
  description: string;
  notes?: string;
  conclusion: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: number;
  files?: {
    id: number;
    name: string;
    formattedSize: string;
    downloadLink: string;
  }[];
}
