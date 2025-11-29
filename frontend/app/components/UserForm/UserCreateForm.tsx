import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Modal from "~/components/modals/ModalSucess";

import {
  getAllDoctors,
  getAllPatients,
  getAllCaregivers,
  createUser
} from "~/services/userService";
import type { BasicListModel } from "~/types/roles/models";
import { SystemRoles } from "~/types/SystemRoles";
import { SystemGenders } from "~/types/gender";
import { useAuth } from "~/hooks/useAuth"; // hook do usuário logado

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

export function UserCreateForm() {
  const { user } = useAuth();
  const currentUserRole = user?.role;

  const [userType, setUserType] = useState<SystemRoles | "">("");
  const [form, setForm] = useState<UserForm>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const toOptions = (list: BasicListModel[]) =>
    list.map(u => ({ value: u.email, label: u.name }));

  const handleSubmit = async () => {
    setErrorMessage(null);
    try {
      await createUser(userType as SystemRoles, form);
      setShowSuccessModal(true);
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
          setErrorMessage("Erro ao criar usuário. Verifique os dados informados.");
        }
      } else {
        setErrorMessage("Erro de conexão com o servidor.");
      }
    }
  };

  const roleOptions = [
    { value: SystemRoles.DOCTOR, label: "Médico" },
    { value: SystemRoles.PATIENT, label: "Paciente" },
    { value: SystemRoles.CAREGIVER, label: "Cuidador" },
    { value: SystemRoles.ADMIN, label: "Administrador" }
  ].filter(r => {
    if (currentUserRole === SystemRoles.DOCTOR) {
      return r.value !== SystemRoles.DOCTOR && r.value !== SystemRoles.ADMIN;
    }
    return true;
  });

  const genderOptions = [
    { value: SystemGenders.M, label: "Masculino" },
    { value: SystemGenders.F, label: "Feminino" }
  ];

  return (
    <div className="flex flex-col items-center justify-start p-3 w-full rounded-2xl shadow-2xl bg-white gap-3">
      <Modal
        isOpen={showSuccessModal}
        onClose={() => window.location.reload()}
        title="Sucesso!"
      >
        Usuário criado com sucesso.
      </Modal>

      <h2 className="text-xl font-bold mb-4">Criar Usuário</h2>

      {/* Select do tipo de usuário */}
      <Select
        options={roleOptions}
        placeholder="Selecione o tipo"
        value={roleOptions.find(opt => opt.value === userType) || null}
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
            mask= "CRM/aa 0000[0000]"
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

      {(userType === SystemRoles.PATIENT || userType === SystemRoles.CAREGIVER) && (
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
            value={genderOptions.find(opt => opt.value === form.gender) || null}
            onChange={(selected) => setForm({ ...form, gender: selected?.value })}
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
        <div className="w-full p-2 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <Button onClick={handleSubmit}>Criar</Button>
    </div>
  );
}
