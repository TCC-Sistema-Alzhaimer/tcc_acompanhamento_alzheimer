import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { ROUTES } from "./routes/EnumRoutes";
import { ro } from "date-fns/locale";

export default [
  layout("./layout/Auth/index.tsx", [
    index("routes/Auth/login.tsx"),
    route(ROUTES.FORGOT_PASSWORD, "routes/Auth/forgotPassword.tsx"),
    route(ROUTES.RESET_PASSWORD, "routes/Auth/resetPassword.tsx"),
    // route(ROUTES.LOGIN, "routes/Auth/login.tsx"),
  ]),

  layout("./layout/Doctor/index.tsx", [
    // route(ROUTES.DOCTOR.EXAMINATION, "routes/Doctor/examination.tsx"),
    //route(ROUTES.DOCTOR.CONCLUSION, "routes/Doctor/conclusion.tsx"),
    // route(ROUTES.DOCTOR.PATIENTS, "routes/Doctor/DoctorPatients.tsx"),
  ]),

  layout("./layout/PrivatePages/index.tsx", [
    route(ROUTES.PRIVATE_HOME, "routes/PrivateWelcome/private_home.tsx"),
    route(ROUTES.ADMIN.MANAGEMENT, "routes/userManagement/userManagement.tsx"),
    route(ROUTES.ASSOCIATION, "routes/Association/association.tsx"),
    route(ROUTES.CHAT, "routes/Chat/chat.tsx"),
    route(ROUTES.DOCTOR.EXAMINATION, "routes/Doctor/examination.tsx"),
    route(ROUTES.DOCTOR.CONCLUSION, "routes/Doctor/conclusion.tsx"),
    route(ROUTES.DOCTOR.PATIENTS, "routes/Doctor/DoctorPatients.tsx"),
    route(ROUTES.DOCTOR.HISTORY, "routes/Doctor/history.tsx"),
    route(ROUTES.DOCTOR.DASHBOARD, "routes/Doctor/dashboard.tsx"),
    route(ROUTES.CAREGIVER.EXAMINATION, "routes/Caregiver/CaregiverExam.tsx"), 
    route(ROUTES.CAREGIVER.PATIENTS, "routes/Caregiver/CaregiverPatients.tsx"),
    route(ROUTES.CAREGIVER.HISTORY, "routes/Caregiver/CaregierHistory.tsx"),
    route(ROUTES.CAREGIVER.CONCLUSION, "routes/Caregiver/CaregiverConclusion.tsx"),
  ]),
] satisfies RouteConfig;
