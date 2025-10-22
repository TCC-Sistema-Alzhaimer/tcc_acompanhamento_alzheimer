import React, { useState } from "react";
import { UserListItem } from "../UserList/UserListItem";
import { UserSearch } from "../UserList/UserSearch";
import { usePatientList } from "./hooks/patient-list";
import Button from "~/components/Button";
import { SystemRoles } from "~/types/SystemRoles";

interface PatientListProps {
  doctorId: number;
  onSelectPatient: (id: number) => void;
  onCreatePatient: () => void;
}

export function PatientList({
  doctorId,
  onSelectPatient,
  onCreatePatient,
}: PatientListProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const { patients, isLoading } = usePatientList({
    doctorId,
    query: searchTerm,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8 text-gray-500">
          Carregando pacientes...
        </div>
      );
    }

    if (patients.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 text-gray-500">
          Nenhum paciente encontrado.
        </div>
      );
    }

    return patients.map((p) => (
      <UserListItem
        key={p.id}
        user={{ ...p, userType: SystemRoles.PATIENT }}
        selected={selectedId === p.id}
        onClick={() => {
          if (!p.id) return;
          setSelectedId(p.id);
          onSelectPatient(p.id);
        }}
      />
    ));
  };

  return (
    <div className="border-r flex flex-col h-full bg-white">
      <div className="flex flex-col p-3 border-b border-gray-100">
        <UserSearch onSearch={handleSearch} />
      </div>

      <div className="flex-1 overflow-y-auto p-2">{renderContent()}</div>

      <div className="p-4 border-t border-gray-100">
        <Button onClick={onCreatePatient} variant="dashed">
          Gerenciar pacientes
        </Button>
      </div>
    </div>
  );
}
