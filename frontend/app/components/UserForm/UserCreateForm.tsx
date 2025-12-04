import { useState } from "react";
import Select from "react-select";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { useToast } from "~/context/ToastContext";

import { createUser } from "~/services/userService";
import { SystemRoles } from "~/types/SystemRoles";
import { SystemGenders } from "~/types/gender";
import { useAuth } from "~/hooks/useAuth";

type UserForm = {
  name?: string;
  cpf?: string;
  phone?: string;
  email?: string;
  password?: string;
  crm?: string;
  specialty?: string;
  birthdate?: string;
  gender?: string;
  address?: string;
  patientEmails?: string[];
  doctorEmails?: string[];
  caregiverEmails?: string[];
};

interface UserCreateFormProps {
  onUserCreated?: () => void;
}

export function UserCreateForm({ onUserCreated }: UserCreateFormProps) {
  const { user } = useAuth();
  const toast = useToast();
  const currentUserRole = user?.role;

  const [userType, setUserType] = useState<SystemRoles | "">("");
  const [form, setForm] = useState<UserForm>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateForm = (): string | null => {
    if (!userType) {
      return "Selecione o tipo de usuário.";
    }
    if (!form.name?.trim()) {
      return "Nome é obrigatório.";
    }
    if (!form.cpf?.trim()) {
      return "CPF é obrigatório.";
    }
    if (!form.email?.trim()) {
      return "Email é obrigatório.";
    }
    if (!form.phone?.trim()) {
      return "Telefone é obrigatório.";
    }
    if (!form.password?.trim()) {
      return "Senha é obrigatória.";
    }

    if (userType === SystemRoles.DOCTOR) {
      if (!form.crm?.trim()) {
        return "CRM é obrigatório para médicos.";
      }
    }

    if (
      userType === SystemRoles.PATIENT ||
      userType === SystemRoles.CAREGIVER
    ) {
      if (!form.birthdate) {
        return "Data de nascimento é obrigatória.";
      }
      if (!form.gender) {
        return "Gênero é obrigatório.";
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser(userType as SystemRoles, form);
      toast.success("Usuário criado com sucesso!");
      setForm({});
      setUserType("");
      onUserCreated?.();
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        if (data?.message) {
          setErrorMessage(data.message);
        } else if (typeof data === "string") {
          setErrorMessage(data);
        } else if (data?.error) {
          setErrorMessage(data.error);
        } else {
          setErrorMessage(
            "Erro ao criar usuário. Verifique os dados informados."
          );
        }
      } else {
        setErrorMessage("Erro de conexão com o servidor.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: SystemRoles.DOCTOR, label: "Médico" },
    { value: SystemRoles.PATIENT, label: "Paciente" },
    { value: SystemRoles.CAREGIVER, label: "Cuidador" },
    { value: SystemRoles.ADMIN, label: "Administrador" },
  ].filter((r) => {
    if (currentUserRole === SystemRoles.DOCTOR) {
      return r.value !== SystemRoles.DOCTOR && r.value !== SystemRoles.ADMIN;
    }
    return true;
  });

  const genderOptions = [
    { value: SystemGenders.M, label: "Masculino" },
    { value: SystemGenders.F, label: "Feminino" },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-full gap-4">
      <h2 className="text-xl font-bold text-gray-800">Criar Usuário</h2>

      {/* Select do tipo de usuário */}
      <Select
        options={roleOptions}
        placeholder="Selecione o tipo"
        value={roleOptions.find((opt) => opt.value === userType) || null}
        onChange={(selected) => setUserType(selected?.value || "")}
        className="w-full"
      />

      {/* Campos comuns */}
      <Input
        placeholder="Nome"
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
      <Input
        type="email"
        placeholder="Email"
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
      <Input
        type="password"
        placeholder="Senha"
        value={form.password || ""}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      >
        Senha
      </Input>

      {/* Campos específicos */}
      {userType === SystemRoles.DOCTOR && (
        <>
          <Input
            placeholder="CRM"
            value={form.crm || ""}
            onChange={(e) => setForm({ ...form, crm: e.target.value })}
            mask="CRM/aa 0000[0000]"
          >
            CRM
          </Input>
          <Input
            placeholder="Especialidade"
            value={form.specialty || ""}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          >
            Especialidade
          </Input>
        </>
      )}

      {(userType === SystemRoles.PATIENT ||
        userType === SystemRoles.CAREGIVER) && (
        <>
          <Input
            type="date"
            placeholder="Data de nascimento"
            value={form.birthdate || ""}
            onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
          >
            Data de Nascimento
          </Input>

          <Select
            options={genderOptions}
            placeholder="Selecione gênero"
            value={
              genderOptions.find((opt) => opt.value === form.gender) || null
            }
            onChange={(selected) =>
              setForm({ ...form, gender: selected?.value })
            }
            className="w-full"
          />

          <Input
            placeholder="Endereço"
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          >
            Endereço
          </Input>
        </>
      )}

      {errorMessage && (
        <div className="w-full p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {errorMessage}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Criar"}
      </Button>
    </div>
  );
}
