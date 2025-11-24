import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Modal from "~/components/modals/ModalSucess";

import {
  updateUser,
  getUserById
} from "~/services/userService";
import type { BasicListModel } from "~/types/roles/models";
import { SystemRoles } from "~/types/SystemRoles";
import { SystemGenders } from "~/types/gender";
import type { DoctorModel, PatientModel, CaregiverModel } from "~/types/roles/models";

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
  userId: number | null ;
  userType: SystemRoles;
}

export function UserEditForm({ userId, userType }: UserEditFormProps) {
  const [form, setForm] = useState<UserForm>({});
  const [doctors, setDoctors] = useState<BasicListModel[]>([]);
  const [patients, setPatients] = useState<BasicListModel[]>([]);
  const [caregivers, setCaregivers] = useState<BasicListModel[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Carregar dados do usuário para edição
  useEffect(() => {
    if (userId) {
      getUserById(userType, userId)
        .then(res => {
          const data = res.data;

          const birthdate =
            "birthdate" in data && data.birthdate
              ? new Date(data.birthdate).toISOString().split("T")[0]
              : "";

          let gender = "";
          if ("gender" in data && data.gender) {
            const g = data.gender.toUpperCase();
            gender = g === "M" || g === "F" ? g : "";
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
    list.map(u => ({ value: u.email, label: u.name }));

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

const handleSubmit = async () => {
  setErrorMessage(null);
  try {
    await updateUser(userType, userId!, form);
    setShowSuccessModal(true);
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;
      if (typeof data === "string") {
        setErrorMessage(data);
      } else if (data.error) {
        setErrorMessage(data.error);
      } else {
        setErrorMessage("Erro ao atualizar usuário. Verifique os dados informados.");
      }
    } else {
      setErrorMessage("Erro de conexão com o servidor.");
    }
  }
};

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
        Usuário atualizado com sucesso.
      </Modal>

      <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>

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


      {/* Campos específicos */}
      {userType === SystemRoles.DOCTOR && (
        <>
          <Input
            placeholder="CRM"
            value={form.crm || ""}
            onChange={(e) => setForm({ ...form, crm: e.target.value })}
          >
            CRM
          </Input>
          <Input
            placeholder="Especialidade"
            value={form.speciality || ""}
            onChange={(e) => setForm({ ...form, speciality: e.target.value })}
          >
            Especialidade
          </Input>

          <Select
            options={toOptions(patients)}
            isMulti
            isDisabled={true} 
            placeholder="Pacientes"
            value={(form.patientEmails || []).map(email => ({ value: email, label: email }))}
            onChange={(selected) => setForm({ ...form, patientEmails: selected.map(s => s.value) })}
            className="w-full"
          />
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
            onChange={(selected) => setForm({ ...form, gender: selected?.value || "" })}
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

      {userType === SystemRoles.PATIENT && (
        <>
          <Select
            options={toOptions(doctors)}
            isMulti
            isDisabled={true} 
            placeholder="Médicos"
            value={(form.doctorEmails || []).map(email => ({ value: email, label: email }))}
            onChange={(selected) => setForm({ ...form, doctorEmails: selected.map(s => s.value) })}
            className="w-full"
          />

          <Select
            options={toOptions(caregivers)}
            isMulti
            isDisabled={true} 
            placeholder="Cuidadores"
            value={(form.caregiverEmails || []).map(email => ({ value: email, label: email }))}
            onChange={(selected) => setForm({ ...form, caregiverEmails: selected.map(s => s.value) })}
            className="w-full"
          />
        </>
      )}

      {userType === SystemRoles.CAREGIVER && (
        <Select
          options={toOptions(patients)}
          isMulti
          isDisabled={true} 
          placeholder="Pacientes"
          value={(form.patientEmails || []).map(email => ({ value: email, label: email }))}
          onChange={(selected) => setForm({ ...form, patientEmails: selected.map(s => s.value) })}
          className="w-full"
        />
      )}

      <Button onClick={handleSubmit}>Salvar</Button>
    </div>
  );
}
