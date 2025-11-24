export const ROUTES = {
  LOGIN: "/login",
  HOME: "/home",
  PROFILE: "/profile",
  USER: "/user/:id",
  CHAT: "/chat",
  PRIVATE_HOME: "/private-home",
  ASSOCIATION: "/association",

  ADMIN: {
    MANAGEMENT: "/management",
  },

  DOCTOR: {
    DASHBOARD: "/doctor/dashboard",
    PATIENTS: "/doctor/patients",
    APPOINTMENTS: "/doctor/appointments",
    EXAMINATION: "/doctor/examination",
    CONCLUSION: "/doctor/conclusion",
    HISTORY: "/doctor/history",
  },

  CAREGIVER: {
    EXAMINATION: "/caregiver/examination/:examId?",
    DASHBOARD: "/caregiver/dashboard",
  },

  user: (id: string) => `/user/${id}`,
} as const;
