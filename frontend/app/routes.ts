import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { ROUTES } from "./routes/EnumRoutes";

export default [
  layout("./layout/Auth/index.tsx", [
    index("routes/Auth/login.tsx"),
    route(ROUTES.LOGIN, "routes/Auth/login.tsx"),
  ]),

  layout("./layout/Doctor/index.tsx", [
    // route(ROUTES.DOCTOR.EXAMINATION, "routes/Doctor/examination.tsx"),
    //route(ROUTES.DOCTOR.CONCLUSION, "routes/Doctor/conclusion.tsx"),
    // route(ROUTES.DOCTOR.PATIENTS, "routes/Doctor/DoctorPatients.tsx"),
  ]),

  layout("./layout/Patient/index.tsx", [
    route(ROUTES.CAREGIVER.EXAMINATION, "routes/Caregiver/exam.tsx"),
  ]),

  layout("./layout/PrivatePages/index.tsx", [
    route(ROUTES.PRIVATE_HOME, "routes/PrivateWelcome/private_home.tsx"),
    route(ROUTES.ADMIN.MANAGEMENT, "routes/userManagement/userManagement.tsx"),
    route(ROUTES.ASSOCIATION, "routes/Association/association.tsx"),
    route(ROUTES.DOCTOR.EXAMINATION, "routes/Doctor/examination.tsx"),
    route(ROUTES.DOCTOR.CONCLUSION, "routes/Doctor/conclusion.tsx"),
    route(ROUTES.DOCTOR.PATIENTS, "routes/Doctor/DoctorPatients.tsx"),
    route(ROUTES.DOCTOR.HISTORY, "routes/Doctor/history.tsx"),
    route(ROUTES.DOCTOR.DASHBOARD, "routes/Doctor/dashboard.tsx"),
  ]),
] satisfies RouteConfig;
