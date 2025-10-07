export interface ExamType {
  id: string;
  description: string;
}

export interface ExamStatus {
  id: string;
  description: string;
}

export interface Exam {
  id?: string;
  doctorId: string;
  patientId: string;
  type: ExamType;
  status: ExamStatus;
  requestDate: string;
  intructions?: string;
  result?: string;
  note: string;
  updatedAt?: string;
  updatedBy?: string;
}
