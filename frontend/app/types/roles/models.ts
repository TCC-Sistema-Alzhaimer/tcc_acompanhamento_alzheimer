import {SystemRoles} from "~/types/SystemRoles";

export type AdminModel = {
  id?: number;
  cpf: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  type: SystemRoles.ADMIN;
};

export type DoctorModel = {
  id?: number;
  cpf: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  crm: string;
  specialty: string;
  patients?: PatientModel[];
  type: SystemRoles.DOCTOR;
};

export type PatientModel = {
  id?: number;
  cpf: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  birthdate: Date;
  gender: string;
  address: string;
  caregivers?: CaregiverModel[]; 
  doctors?: DoctorModel[];
  type: SystemRoles.PATIENT;     
};

export type CaregiverModel = {
  id?: number;
  cpf: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  birthdate: Date;
  gender: string;
  address: string;
  patients?: PatientModel[]; 
  type: SystemRoles.CARREGIVER;
};

export type BasicListModel = {
  id?: number;
  name: string;
  phone: string;
  email: string;
  userType: SystemRoles;
};