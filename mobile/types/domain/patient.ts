import { GENDER } from "../enum/gender";

export interface Patient {
  id: Number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  gender: GENDER;
  address: string;
  birthdate: string;
  doctorEmails: string[];
  caregiverEmails: string[];
}
