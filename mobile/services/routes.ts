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
  PATIENT_BY_ID: (patientId: string) => `/patients/${patientId}`,

  DOCTORS: "/doctors",
  DOCTOR_BY_ID: (doctorId: string) => `/doctors/${doctorId}`,

  NOTIFICATIONS: "/notifications",
  NOTIFICATION_BY_ID: (notificationId: string) =>
    `/notifications/${notificationId}`,
  NOTIFICATIONS_BY_PATIENT_ID: (patientId: string) =>
    `/notifications/patient/${patientId}`,
  NOTIFICATION_MARK_AS_READ: (notificationId: string, readerId: string) =>
    `/notifications/${notificationId}/recipients/${readerId}/read`,
};
