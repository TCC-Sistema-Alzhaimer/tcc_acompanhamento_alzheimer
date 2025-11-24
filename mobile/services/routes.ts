export const ROUTES = {
  LOGIN: "api/auth/login",
  LOGOUT: "api/auth/logout",
  LOGIN_SESSION: "/api/auth/login_session",
  REFRESH: "/api/auth/refresh",

  EXAMS: "/exams",
  EXAM_BY_ID: (examId: string) => `/exams/${examId}`,
  EXAM_BY_PATIENT_ID: (patientId: string) => `/exams/patient/${patientId}`,
  EXAM_BY_DOCTOR_ID: (doctorId: string) => `/exams/doctor/${doctorId}`,
  EXAM_ATTACHMENTS: (examId: string) => `/exams/${examId}/results/upload`,
  UPLOAD_HISTORIC_EXAM_ATTACHMENT: "/medical-history",
  HISTORIC_EXAMS_BY_PATIENT_ID: (patientId: string) =>
    `/medical-history/patient/${patientId}`,
  CONCLUSIONS: "/conclusions",
  CONCLUSION_BY_ID: (conclusionId: string) =>
    `/conclusions/${conclusionId}`,
  CONCLUSIONS_BY_EXAM_ID: (examId: string) =>
    `/conclusions/exam/${examId}`,

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
  NOTIFICATION_MARK_AS_READ: (notificationId: string) =>
    `/notifications/${notificationId}/read`,

  ASSOCIATIONS: "/requests",
  ASSOCIATION_BY_ID: (associationId: string) => `/requests/${associationId}`,

  CHATS: "/chats",
  CHAT_BY_ID: (chatId: string) => `/chats/${chatId}`,
  CHAT_PARTICIPANTS: (chatId: string) => `/chats/${chatId}/participants`,
  CHAT_MESSAGES: (chatId: string) => `/chats/${chatId}/messages`,
  CHAT_NEW_MESSAGES: (chatId: string) => `/chats/${chatId}/messages/new`,
  CHAT_READ: (chatId: string) => `/chats/${chatId}/messages/read`,
};
