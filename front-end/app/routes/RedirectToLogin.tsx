import { ROUTES } from "../routes/EnumRoutes";

export default function RedirectToLogin() {
  window.location.href = ROUTES.LOGIN;
  return null;
}
