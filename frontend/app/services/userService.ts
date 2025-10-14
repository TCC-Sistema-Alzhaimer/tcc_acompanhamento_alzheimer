import { api } from "./api";
import type { BasicListModel } from "~/types/roles/models";
import type { CreateDoctorDTO, CreatePatientDTO, CreateCaregiverDTO, CreateAdminDTO } from "~/types/roles/dtos";
import { SystemRoles } from "~/types/SystemRoles";
import type {
  DoctorModel,
  PatientModel,
  CaregiverModel,
  AdminModel,
} from "~/types/roles/models";

// Busca todos os usuários
export const getAllUsers = () => {
  return api.get<BasicListModel[]>("/users", {
    withCredentials: true, 
  });
};

// Busca usuários por termo de pesquisa
export const searchUsers = (query: string) => {
  return api.get<BasicListModel[]>(`/users/search?query=${encodeURIComponent(query)}`, {
    withCredentials: true, 
  });
};

// GET listas para seleção (medicos, pacientes, cuidadores)
export const getAllDoctors = () => api.get<BasicListModel[]>("doctors");
export const getAllPatients = () => api.get<BasicListModel[]>("patients");
export const getAllCaregivers = () => api.get<BasicListModel[]>("caregivers");

// POST criação de usuários
export const createDoctor = (data: CreateDoctorDTO) => api.post("doctors", data);
export const createPatient = (data: CreatePatientDTO) => api.post("patients", data);
export const createCaregiver = (data: CreateCaregiverDTO) => api.post("caregivers", data);
export const createAdmin = (data: CreateAdminDTO) => api.post("administrators", data);

export async function createUser(userType: SystemRoles, form: any) {
  console.log(form)
  switch (userType) {
    case SystemRoles.DOCTOR:
      const doctorDto: CreateDoctorDTO = {
        cpf: form.cpf,
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        crm: form.crm,
        speciality: form.specialty,
        patientEmails: form.patientEmails || [],
      };
      return createDoctor(doctorDto);

    case SystemRoles.PATIENT:
      const patientDto: CreatePatientDTO = {
        cpf: form.cpf,
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        birthdate: new Date(form.birthdate),
        gender: form.gender,
        address: form.address,
        doctorEmails: form.doctorEmails || [],
        caregiverEmails: form.caregiverEmails || [],
      };
      return createPatient(patientDto);

    case SystemRoles.CAREGIVER:
      const caregiverDto: CreateCaregiverDTO = {
        cpf: form.cpf,
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        birthdate: new Date(form.birthdate),
        gender: form.gender,
        address: form.address,
        patientEmails: form.patientEmails || [],
      };
      return createCaregiver(caregiverDto);

    case SystemRoles.ADMIN:
      const adminDto: CreateAdminDTO = {
        cpf: form.cpf,
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      };
      return createAdmin(adminDto);

    default:
      throw new Error("Tipo de usuário inválido");
  }
}

export async function getUserById(userType: SystemRoles, id: number) {
  switch (userType) {
    case SystemRoles.DOCTOR:
      return api.get<DoctorModel>(`doctors/${id}`);
    case SystemRoles.PATIENT:
      return api.get<PatientModel>(`patients/${id}`);
    case SystemRoles.CAREGIVER:
      return api.get<CaregiverModel>(`caregivers/${id}`);
    case SystemRoles.ADMIN:
      return api.get<AdminModel>(`administrators/${id}`);
    default:
      throw new Error("Tipo de usuário inválido");
  }
}

export async function updateUser(userType: SystemRoles, id: number, data: any) {
  switch (userType) {
    case SystemRoles.DOCTOR:
      return api.put(`doctors/${id}`, data);
    case SystemRoles.PATIENT:
      return api.put(`patients/${id}`, data);
    case SystemRoles.CAREGIVER:
      return api.put(`caregivers/${id}`, data);
    case SystemRoles.ADMIN:
      return api.put(`administrators/${id}`, data);
    default:
      throw new Error("Tipo de usuário inválido");
  }
}

export const getPatientsAndCaregivers = () => 
  api.get<BasicListModel[]>("/users/patients-and-caregivers", { withCredentials: true });