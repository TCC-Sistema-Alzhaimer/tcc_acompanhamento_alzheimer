import { Roles } from "../enum/roles";

export interface User {
  id?: Number;
  name: string;
  email: string;

  role?: Roles;
  cpf?: string;
  phone?: string;
}

export interface RecipientStatus extends User {
  read: boolean;
  readAt?: string;
}
