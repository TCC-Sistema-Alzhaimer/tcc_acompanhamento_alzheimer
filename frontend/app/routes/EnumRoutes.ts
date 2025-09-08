export const ROUTES = {
  LOGIN: "/login",
  HOME: "/home",
  PROFILE: "/profile",
  USER: "/user/:id",
  PRIVATE_HOME: "/private-home",

  ADMIN: {
    MANAGEMENT: "/management",
  },

  DOCTOR: {
    DASHBOARD: "/doctor/dashboard",
    PATIENTS: "/doctor/patients",
    APPOINTMENTS: "/doctor/appointments",
    EXAMINATION: "/doctor/examination",
    CONCLUSION: "/doctor/conclusion",
  },

  CAREGIVER: {
    EXAMINATION: "/caregiver/examination/:examId?",
  },

  user: (id: string) => `/user/${id}`,
} as const;