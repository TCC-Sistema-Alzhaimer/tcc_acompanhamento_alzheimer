import { useEffect, useState } from "react";
import type { BasicListModel } from "~/types/roles/models";
import { UserListItem } from "../UserList/UserListItem";
import { UserSearch } from "../UserList/UserSearch";
import { getPatientsByDoctor } from "~/services/doctorService";
import { usePatientList } from "./hooks/patient-list";

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

  return (
    <div className="w-1/4 border-r flex flex-col h-full bg-white">
      <div className="flex flex-col p-3">
        <UserSearch onSearch={handleSearch} />
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Carregando pacientes...</div>
          </div>
        ) : (
          <>
            {patients.map((p) => (
              <UserListItem
                key={p.id}
                user={p}
                selected={selectedId === p.id}
                onClick={() => {
                  if (!p.id) return;
                  setSelectedId(p.id);
                  onSelectPatient(p.id);
                }}
              />
            ))}

            {/* Botão tracejado de gerenciar */}
            <button
              onClick={onCreatePatient}
              className="mx-4 mt-4 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-colors w-[calc(100%-2rem)] text-center"
            >
              Gerenciar fontes
            </button>
          </>
        )}
      </div>
    </div>
  );
}
