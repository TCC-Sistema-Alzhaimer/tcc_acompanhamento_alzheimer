import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { useToast } from "~/context/ToastContext";
import {
  User,
  Mail,
  Phone,
  FileText,
  Stethoscope,
  MapPin,
  Calendar,
  Save,
} from "lucide-react";

import { updateUser, getUserById } from "~/services/userService";
import type { BasicListModel } from "~/types/roles/models";
import { SystemRoles } from "~/types/SystemRoles";
import { SystemGenders } from "~/types/gender";
import type {
  DoctorModel,
  PatientModel,
  CaregiverModel,
} from "~/types/roles/models";

type UserForm = {
  name?: string;
  cpf?: string;
  phone?: string;
  email?: string;
  password?: string;
  crm?: string;
  speciality?: string;
  birthdate?: string;
  gender?: string;
  address?: string;
  patientEmails?: string[];
  doctorEmails?: string[];
  caregiverEmails?: string[];
};

interface UserEditFormProps {
  userId: number | null;
  userType: SystemRoles;
}

export function UserEditForm({ userId, userType }: UserEditFormProps) {
  const [form, setForm] = useState<UserForm>({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Carregar dados do usuário para edição
  useEffect(() => {
    if (userId) {
      getUserById(userType, userId)
        .then((res) => {
          const data = res.data;

          const birthdate =
            "birthdate" in data && data.birthdate
              ? new Date(data.birthdate).toISOString().split("T")[0]
              : "";

          let gender = "";
          if ("gender" in data && data.gender) {
            const g = String(data.gender).toUpperCase();
            // Mapear diferentes formatos para M/F
            if (g === "M" || g === "MALE" || g === "MASCULINO") {
              gender = "M";
            } else if (g === "F" || g === "FEMALE" || g === "FEMININO") {
              gender = "F";
            }
          }

          let doctorEmails: string[] = [];
          let caregiverEmails: string[] = [];
          let patientEmails: string[] = [];

          if (userType === SystemRoles.PATIENT) {
            const patientData = data as PatientModel;
            doctorEmails = patientData.doctorEmails || [];
            caregiverEmails = patientData.caregiverEmails || [];
          } else if (userType === SystemRoles.CAREGIVER) {
            const caregiverData = data as CaregiverModel;
            patientEmails = caregiverData.patientEmails || [];
          } else if (userType === SystemRoles.DOCTOR) {
            const doctorData = data as DoctorModel;
            patientEmails = doctorData.patientEmails || [];
          }

          setForm({
            ...data,
            birthdate,
            gender,
            doctorEmails,
            caregiverEmails,
            patientEmails,
          });
        })
        .catch(console.error);
    }
  }, [userId, userType]);

  const toOptions = (list: BasicListModel[]) =>
    list.map((u) => ({ value: u.email, label: u.name }));

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await updateUser(userType, userId!, form);
      toast.success("Perfil atualizado com sucesso!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        if (typeof data === "string") {
          toast.error(data);
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error(
            "Erro ao atualizar usuário. Verifique os dados informados."
          );
        }
      } else {
        toast.error("Erro de conexão com o servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { value: SystemGenders.M, label: "Masculino" },
    { value: SystemGenders.F, label: "Feminino" },
  ];

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? "#14b8a6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : "none",
      "&:hover": { borderColor: "#14b8a6" },
      borderRadius: "0.5rem",
      padding: "2px 0",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#14b8a6"
        : state.isFocused
          ? "#f0fdfa"
          : "white",
      color: state.isSelected ? "white" : "#374151",
    }),
  };

  const getRoleLabel = () => {
    switch (userType) {
      case SystemRoles.DOCTOR:
        return "Médico";
      case SystemRoles.PATIENT:
        return "Paciente";
      case SystemRoles.CAREGIVER:
        return "Cuidador";
      case SystemRoles.ADMIN:
        return "Administrador";
      default:
        return "Usuário";
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mx-auto">
      {/* Header com tipo de usuário */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
          <User size={20} className="text-teal-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Tipo de conta</p>
          <p className="text-base font-semibold text-gray-900">
            {getRoleLabel()}
          </p>
        </div>
      </div>

      {/* Campos comuns */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <User size={16} />
          Informações Pessoais
        </h3>

        <Input
          placeholder="Digite seu nome"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        >
          Nome
        </Input>

        <Input
          placeholder="Digite o CPF"
          value={form.cpf || ""}
          onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          mask="000.000.000-00"
        >
          CPF
        </Input>
      </div>

      {/* Contato */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Mail size={16} />
          Contato
        </h3>

        <Input
          type="email"
          placeholder="Digite seu email"
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        >
          Email
        </Input>

        <Input
          placeholder="Digite o telefone"
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          mask="(00) 00000-0000"
        >
          Telefone
        </Input>
      </div>

      {/* Campos específicos do médico */}
      {userType === SystemRoles.DOCTOR && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Stethoscope size={16} />
            Informações Profissionais
          </h3>

          <Input
            placeholder="Digite o CRM"
            value={form.crm || ""}
            onChange={(e) => setForm({ ...form, crm: e.target.value })}
            mask= "CRM/aa 0000[0000]"
          >
            CRM
          </Input>

          <Input
            placeholder="Digite a especialidade"
            value={form.speciality || ""}
            onChange={(e) => setForm({ ...form, speciality: e.target.value })}
          >
            Especialidade
          </Input>
        </div>
      )}

      {/* Campos específicos de paciente/cuidador */}
      {(userType === SystemRoles.PATIENT ||
        userType === SystemRoles.CAREGIVER) && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar size={16} />
            Dados Adicionais
          </h3>

          <Input
            type="date"
            placeholder="Data de nascimento"
            value={form.birthdate || ""}
            onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
          >
            Data de Nascimento
          </Input>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Gênero
            </label>
            <Select
              options={genderOptions}
              placeholder="Selecione o gênero"
              value={
                genderOptions.find((opt) => opt.value === form.gender) || null
              }
              onChange={(selected) =>
                setForm({ ...form, gender: selected?.value || "" })
              }
              styles={selectStyles}
            />
          </div>

          <Input
            placeholder="Digite o endereço"
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          >
            Endereço
          </Input>
        </div>
      )}

      {/* Footer com botão de salvar */}
      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading}>
          <Save size={18} className="mr-2" />
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
