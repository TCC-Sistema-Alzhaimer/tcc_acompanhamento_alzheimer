export interface ExamResponse {
  id: number;
  doctorId: number;
  patientId: number;
  examTypeId: string;
  examStatusId: string;
  requestDate: string;
  instructions: string;
  note: string;
  updatedAt: string;
  updatedBy: number;
  examTypeDescription: string;
  examStatusDescription: string;
  doctorName: string;
  patientName: string;
}
