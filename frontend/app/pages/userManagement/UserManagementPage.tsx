import { useState } from "react";
import { UserList } from "~/components/UserList/UserList";
import { UserEditForm } from "~/components/UserForm/UserEditForm";
import { UserCreateForm } from "~/components/UserForm/UserCreateForm";
import { SystemRoles } from "~/types/SystemRoles";
import { useAuth } from "~/hooks/useAuth";

export default function UserManagementPage() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<SystemRoles | "">(
    ""
  );
  const [mode, setMode] = useState<"view" | "create">("view");

  const currentUserRole = user?.role as SystemRoles | undefined;

  const doctorId =
    user?.role === SystemRoles.DOCTOR && user.id ? Number(user.id) : undefined;

  return (
    <main className="grid h-full overflow-hidden gap-6 lg:grid-cols-[360px_1fr]">
      <UserList
        currentUserRole={currentUserRole!}
        doctorId={doctorId}
        onSelectUser={(id, userType) => {
          setSelectedUserId(id);
          setSelectedUserType(userType as SystemRoles);
          setMode("view");
        }}
        onCreateUser={() => {
          setSelectedUserId(null);
          setMode("create");
        }}
      />

      <div className="h-full overflow-y-auto">
        {mode === "view" && !selectedUserId && (
          <div className="flex items-center justify-center h-full text-gray-700 p-6 rounded-lg border-2 border-dashed border-gray-300 bg-white">
            <p>
              Selecione um usuário na lista para editar ou clique em "Criar
              Usuário".
            </p>
          </div>
        )}

        {mode === "view" && selectedUserId && selectedUserType && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <UserEditForm userId={selectedUserId} userType={selectedUserType} />
          </div>
        )}

        {mode === "create" && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <UserCreateForm />
          </div>
        )}
      </div>
    </main>
  );
}
