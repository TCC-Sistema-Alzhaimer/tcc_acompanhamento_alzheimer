export interface ConclusionCreate {
  patientId: number;
  doctorId: number;
  examId: number;
  description: string;
  conclusion: string;
}
