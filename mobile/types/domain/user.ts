import { Roles } from "../enum/roles";

export interface User {
  id: Number;
  email: string;
  role: Roles;
}
