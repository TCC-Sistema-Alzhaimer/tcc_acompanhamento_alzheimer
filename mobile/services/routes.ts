export const ROUTES = {
  LOGIN: "api/auth/login",
  LOGOUT: "api/auth/logout",

  EXAMS: "/exams",
  EXAM_BY_ID: (examId: string) => `/exams/${examId}`,
  EXAM_BY_PATIENT_ID: (patientId: string) => `/exams/patient/${patientId}`,
  EXAM_BY_DOCTOR_ID: (doctorId: string) => `/exams/doctor/${doctorId}`,
  EXAM_ATTACHMENTS: (examId: string) => `/exams/${examId}/results/upload`,

  CAREGIVER: "/caregivers",
  CAREGIVER_BY_ID: (caregiverId: string) => `/caregivers/${caregiverId}`,
  CAREGIVER_PATIENTS: (caregiverId: string) =>
    `/caregivers/${caregiverId}/patients`,

  PATIENTS: "/patients",
};
