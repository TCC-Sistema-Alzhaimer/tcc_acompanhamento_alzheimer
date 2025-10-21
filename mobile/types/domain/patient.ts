import { GENDER } from "../enum/gender";
import { User } from "./user";

export interface Patient extends User {
  gender: GENDER;
  address: string;
  birthdate: string;
  doctorEmails: string[];
  caregiverEmails: string[];
}
