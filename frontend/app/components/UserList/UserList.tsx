import { useEffect, useState, useCallback } from "react";
import clsx from "clsx";
import { Loader2, Plus, RefreshCcw } from "lucide-react";
import type { BasicListModel } from "~/types/roles/models";
import { UserListItem } from "./UserListItem";
import { UserSearch } from "./UserSearch";
import {
  getPatientsAndCaregivers,
  searchUsers,
  getAllUsers,
} from "~/services/userService";
import { getPatientsByDoctor } from "~/services/doctorService";
import { SystemRoles } from "~/types/SystemRoles";
import { Button } from "~/components/ui/button";
import ButtonLegacy from "~/components/Button";

interface UserListProps {
  onSelectUser: (id: number, userType: string) => void;
  onCreateUser: () => void;
  currentUserRole: SystemRoles;
  doctorId?: number;
}

export function UserList({
  onSelectUser,
  onCreateUser,
  currentUserRole,
  doctorId,
}: UserListProps) {
  const [users, setUsers] = useState<BasicListModel[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    if (currentUserRole === SystemRoles.DOCTOR && doctorId) {
      getPatientsAndCaregivers()
        .then((res) => setUsers(res.data))
        .catch((err) =>
          console.error("Erro ao buscar pacientes e cuidadores:", err)
        )
        .finally(() => setIsLoading(false));
    } else {
      getAllUsers()
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Erro ao buscar usuários:", err))
        .finally(() => setIsLoading(false));
    }
  }, [currentUserRole, doctorId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      if (term.trim()) {
        setIsLoading(true);
        searchUsers(term)
          .then((res) => setUsers(res.data))
          .catch((err) => console.error("Erro na busca de usuários:", err))
          .finally(() => setIsLoading(false));
      } else {
        fetchUsers();
      }
    },
    [fetchUsers]
  );

  const renderContent = () => {
    if (isLoading) {
      return <UserListSkeleton />;
    }

    if (users.length === 0) {
      return (
        <UserListState
          title="Nenhum usuário encontrado"
          description="Tente ajustar a busca ou atualize a lista."
          actionLabel="Atualizar"
          onAction={fetchUsers}
        />
      );
    }

    return users.map((u) => (
      <UserListItem
        key={u.id}
        user={u}
        selected={selectedId === u.id}
        onClick={() => {
          setSelectedId(u.id!);
          onSelectUser(u.id!, u.userType);
        }}
      />
    ));
  };

  return (
    <aside className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-4 py-3 flex-shrink-0">
        <UserSearch onSearch={handleSearch} placeholder="Buscar usuário..." />
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div
          className={clsx(
            "flex flex-col",
            users.length > 0 ? "gap-2" : "gap-0"
          )}
        >
          {renderContent()}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <ButtonLegacy onClick={onCreateUser} variant="primary">
          <Plus size={18} className="mr-2" />
          Criar Usuário
        </ButtonLegacy>
      </div>
    </aside>
  );
}

function UserListState({
  title,
  description,
  actionLabel,
  onAction,
  tone = "default",
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-6 text-center",
        tone === "error"
          ? "border-red-200 bg-red-50/40 text-red-600"
          : "border-gray-200 bg-gray-50 text-gray-600"
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-current/80">{description}</p>
      {actionLabel && onAction && (
        <Button
          size="sm"
          variant={tone === "error" ? "destructive" : "outline"}
          onClick={onAction}
          className="mt-1"
        >
          <RefreshCcw size={14} className="mr-1" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

function UserListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`user-skeleton-${index}`}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
