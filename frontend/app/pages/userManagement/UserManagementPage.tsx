import { useState } from "react";
import { UserList } from "~/components/UserList/UserList";
import { UserEditForm } from "~/components/UserForm/UserEditForm";
import { UserCreateForm } from "~/components/UserForm/UserCreateForm";
import { SystemRoles } from "~/types/SystemRoles";
import { useAuth } from "~/hooks/useAuth"; // hook de autenticação

export default function UserManagementPage() {
  const { user } = useAuth(); // usuário logado
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<SystemRoles | "">("");
  const [mode, setMode] = useState<"view" | "create">("view");

  // Somente passamos a role se existir e for do tipo correto
  const currentUserRole = user?.role as SystemRoles | undefined;

  // Se o usuário for médico, pegamos o ID dele como number
  const doctorId = user?.role === SystemRoles.DOCTOR && user.id
    ? Number(user.id)
    : undefined;

  return (
    <div className="flex h-full">
      <UserList
        currentUserRole={currentUserRole!} // o "!" garante que não é undefined
        doctorId={doctorId} // undefined se não for médico
        onSelectUser={(id, userType) => {
          setSelectedUserId(id);
          setSelectedUserType(userType as SystemRoles); // cast para SystemRoles
          setMode("view");
        }}
        onCreateUser={() => setMode("create")}
      />

      <div className="flex-1 p-4">
        {mode === "view" && selectedUserId && selectedUserType && (
          <UserEditForm
            userId={selectedUserId}
            userType={selectedUserType}
          />
        )}
        {mode === "create" && <UserCreateForm />}
      </div>
    </div>
  );
}
