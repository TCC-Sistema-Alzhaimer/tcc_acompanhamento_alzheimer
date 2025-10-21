import { Roles } from "../enum/roles";

export interface User {
  id: number;
  email: string;
  role: Roles;
  name?: string;
}
