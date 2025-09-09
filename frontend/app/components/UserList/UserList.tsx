import { useEffect, useState } from "react";
import type { BasicListModel } from "~/types/roles/models";
import { UserListItem } from "./UserListItem";
import { UserSearch } from "./UserSearch";
import { getPatientsAndCaregivers, searchUsers, getAllUsers } from "~/services/userService";
import { getPatientsByDoctor } from "~/services/doctorService";
import { SystemRoles } from "~/types/SystemRoles";

interface UserListProps {
  onSelectUser: (id: number, userType: string) => void;
  onCreateUser: () => void;
  currentUserRole: SystemRoles;
  doctorId?: number;
}


export function UserList({ onSelectUser, onCreateUser, currentUserRole, doctorId }: UserListProps) {
  const [users, setUsers] = useState<BasicListModel[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (currentUserRole === SystemRoles.DOCTOR && doctorId) {
      getPatientsAndCaregivers()
        .then(res => setUsers(res.data))
        .catch(err => console.error("Erro ao buscar pacientes e cuidadores:", err));
    } else {
      getAllUsers()
        .then(res => setUsers(res.data))
        .catch(err => console.error("Erro ao usuários:", err));
    }
  }, [currentUserRole, doctorId]);


  const handleSearch = (term: string) => { searchUsers(term).then((res) => setUsers(res.data)).catch((err) => console.error("Erro na busca de usuários:", err)); };

  return (
    <div className="w-1/4 border-r flex flex-col h-full">
      <div className="flex flex-col">
        <UserSearch onSearch={handleSearch} />
        <button
          onClick={onCreateUser}
          className="m-3 p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
        >
          Criar Usuário
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map(u => (
          <UserListItem
            key={u.id}
            user={u}
            selected={selectedId === u.id}
            onClick={() => {
              setSelectedId(u.id!);
              onSelectUser(u.id!, u.userType);
            }}
          />
        ))}
      </div>
    </div>
  );
}
