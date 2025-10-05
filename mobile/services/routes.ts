export const ROUTES = {
  LOGIN: "api/auth/login",
  LOGOUT: "api/auth/logout",

  EXAMS: "/exams",
  EXAM_BY_ID: (examId: string) => `/exams/${examId}`,
  EXAM_BY_PATIENT_ID: (patientId: string) => `/exams/patient/${patientId}`,
  EXAM_BY_DOCTOR_ID: (doctorId: string) => `/exams/doctor/${doctorId}`,
};
