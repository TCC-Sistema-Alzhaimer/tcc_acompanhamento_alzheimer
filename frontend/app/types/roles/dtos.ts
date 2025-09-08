export type CreateDoctorDTO = {
  cpf: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  crm: string;
  speciality: string;
  patientEmails?: string[];
};

export type CreatePatientDTO = {
  cpf: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  birthdate: Date;
  gender: string;
  address: string;
  caregiverEmails?: string[]; 
  doctorEmails?: string[];   
};

export type CreateCaregiverDTO = {
  cpf: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  birthdate: Date;
  gender: string;
  address: string;
  patientEmails?: string[];
};

export type CreateAdminDTO = {
  cpf: string;
  name: string;
  phone: string;
  email: string;
  password: string;
};