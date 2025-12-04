import { useEffect, useState } from "react";
import Select from "react-select";
import {
  getAllDoctors,
  getAllPatients,
  getAllCaregivers,
} from "~/services/userService";
import { SystemRoles } from "~/types/SystemRoles";

type UserOption = { label: string; value: string };

interface UserSelectProps {
  role: SystemRoles;
  value: string;
  onChange: (email: string) => void;
  isDisabled?: boolean;
}

export function UserSelect({
  role,
  value,
  onChange,
  isDisabled,
}: UserSelectProps) {
  const [options, setOptions] = useState<UserOption[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        let users: { name: string; email: string }[] = [];

        if (role === SystemRoles.DOCTOR) {
          const res = await getAllDoctors();
          users = res.data;
        } else if (role === SystemRoles.PATIENT) {
          const res = await getAllPatients();
          users = res.data;
        } else if (role === SystemRoles.CAREGIVER) {
          const res = await getAllCaregivers();
          users = res.data;
        }

        const formatted: UserOption[] = users.map((u) => ({
          label: `${u.name} (${u.email})`,
          value: u.email,
        }));

        setOptions(formatted);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      }
    }

    fetchUsers();
  }, [role]);

  // selecionado baseado no email atual
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const roleLabels: Record<SystemRoles, string> = {
    [SystemRoles.DOCTOR]: "Médico",
    [SystemRoles.PATIENT]: "Paciente",
    [SystemRoles.CAREGIVER]: "Cuidador",
    [SystemRoles.ADMIN]: "Administrador",
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(opt) => onChange(opt?.value || "")}
      placeholder={`Selecione ${roleLabels[role] || role}`}
      isDisabled={isDisabled} // <- aqui
    />
  );
}
