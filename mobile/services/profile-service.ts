import { Roles } from "@/types/enum/roles";
import { api } from "./api";
import { ROUTES } from "./routes";

export interface ProfileFormData {
  id: number;
  role: Roles;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  crm?: string;
  speciality?: string;
  birthdate?: string;
  gender?: string;
  address?: string;
  patientEmails?: string[];
  doctorEmails?: string[];
  caregiverEmails?: string[];
}

interface FetchProfileParams {
  userId: number;
  role: Roles;
  accessToken: string;
}

interface UpdateProfileParams {
  accessToken: string;
  form: ProfileFormData;
  password?: string;
}

export async function fetchProfile({
  userId,
  role,
  accessToken,
}: FetchProfileParams): Promise<ProfileFormData> {
  const headers = { Authorization: `Bearer ${accessToken}` };

  switch (role) {
    case Roles.DOCTOR: {
      const { data } = await api.get<{
        cpf: string;
        name: string;
        email: string;
        phone: string;
        crm: string;
        speciality: string;
        patientEmails: string[];
      }>(ROUTES.DOCTOR_BY_ID(String(userId)), { headers });

      return {
        id: userId,
        role,
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        crm: data.crm,
        speciality: data.speciality,
        patientEmails: data.patientEmails ?? [],
      };
    }
    case Roles.CAREGIVER: {
      const { data } = await api.get<{
        cpf: string;
        name: string;
        email: string;
        phone: string;
        birthdate: string;
        gender: string;
        address: string;
        patientEmails: string[];
      }>(ROUTES.CAREGIVER_BY_ID(String(userId)), { headers });

      return {
        id: userId,
        role,
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        birthdate: data.birthdate,
        gender: data.gender,
        address: data.address,
        patientEmails: data.patientEmails ?? [],
      };
    }
    case Roles.PATIENT: {
      const { data } = await api.get<{
        name: string;
        cpf: string;
        email: string;
        phone: string;
        gender: string;
        address: string;
        birthdate: string;
        doctorEmails: string[];
        caregiverEmails: string[];
      }>(ROUTES.PATIENT_BY_ID(String(userId)), { headers });

      return {
        id: userId,
        role,
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        gender: data.gender,
        address: data.address,
        birthdate: data.birthdate,
        doctorEmails: data.doctorEmails ?? [],
        caregiverEmails: data.caregiverEmails ?? [],
      };
    }
    default:
      return {
        id: userId,
        role,
        name: "",
        email: "",
      };
  }
}

export async function updateProfile({
  accessToken,
  form,
  password,
}: UpdateProfileParams) {
  const headers = { Authorization: `Bearer ${accessToken}` };

  switch (form.role) {
    case Roles.DOCTOR: {
      const payload = {
        cpf: form.cpf ?? "",
        name: form.name,
        email: form.email,
        phone: form.phone ?? "",
        crm: form.crm ?? "",
        speciality: form.speciality ?? "",
        patientEmails: form.patientEmails ?? [],
        userType: Roles.DOCTOR,
        ...(password ? { password } : {}),
      };
      await api.put(ROUTES.DOCTOR_BY_ID(String(form.id)), payload, {
        headers,
      });
      return;
    }
    case Roles.CAREGIVER: {
      const payload = {
        cpf: form.cpf ?? "",
        name: form.name,
        email: form.email,
        phone: form.phone ?? "",
        birthdate: form.birthdate ?? null,
        gender: form.gender ?? "",
        address: form.address ?? "",
        patientEmails: form.patientEmails ?? [],
        userType: Roles.CAREGIVER,
        ...(password ? { password } : {}),
      };
      await api.put(ROUTES.CAREGIVER_BY_ID(String(form.id)), payload, {
        headers,
      });
      return;
    }
    case Roles.PATIENT: {
      const payload = {
        cpf: form.cpf ?? "",
        name: form.name,
        email: form.email,
        phone: form.phone ?? "",
        birthdate: form.birthdate ?? null,
        gender: form.gender ?? "",
        address: form.address ?? "",
        doctorEmails: form.doctorEmails ?? [],
        caregiverEmails: form.caregiverEmails ?? [],
        userType: Roles.PATIENT,
        ...(password ? { password } : {}),
      };
      await api.put(ROUTES.PATIENT_BY_ID(String(form.id)), payload, {
        headers,
      });
      return;
    }
    default:
      throw new Error("Profile update is not supported for this role.");
  }
}
