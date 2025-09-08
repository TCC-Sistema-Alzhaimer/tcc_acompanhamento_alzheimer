import { useEffect, useState } from "react";
import type { BasicListModel } from "~/types/roles/models";
import { UserListItem } from "./UserListItem";
import { UserSearch } from "./UserSearch";
import { getAllUsers, searchUsers } from "~/services/userService";

interface UserListProps {
  onSelectUser: (id: number) => void;
  onCreateUser: () => void;
}

export function UserList({ onSelectUser, onCreateUser }: UserListProps) {
  const [users, setUsers] = useState<BasicListModel[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Erro ao buscar usuários:", err));
  }, []);

  const handleSearch = (term: string) => {
    searchUsers(term)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Erro na busca de usuários:", err));
  };

  return (
    <div className="w-1/4 border-r flex flex-col h-full">
      {/* Search e botão não roláveis */}
      <div className="flex flex-col">
        <UserSearch onSearch={handleSearch} />
        <button
          onClick={onCreateUser}
          className="m-3 p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
        >
          Criar Usuário
        </button>
      </div>

      {/* Lista de usuários scrollable */}
      <div className="flex-1 overflow-y-auto">
        {users.map((u) => (
          <UserListItem
            key={u.id}
            user={u}
            selected={selectedId === u.id}
            onClick={() => {
              setSelectedId(u.id!);
              onSelectUser(u.id!);
            }}
          />
        ))}
      </div>
    </div>
  );
}


