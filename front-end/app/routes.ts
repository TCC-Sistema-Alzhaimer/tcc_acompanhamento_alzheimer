import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";
import { ROUTES } from "./routes/EnumRoutes";

export default [
    
    layout("./layout/Auth/index.tsx", [
        route(ROUTES.LOGIN, "routes/Auth/login.tsx"),
    ]),

    layout("./layout/Doctor/index.tsx", [
        route(ROUTES.DOCTOR.EXAMINATION, "routes/Doctor/examination.tsx"),
        route(ROUTES.DOCTOR.CONCLUSION, "routes/Doctor/conclusion.tsx"),
    ]),
    
    layout("./layout/Patient/index.tsx", [
        route(ROUTES.CAREGIVER.EXAMINATION, "routes/Caregiver/exam.tsx"),
    ]),

] satisfies RouteConfig;
