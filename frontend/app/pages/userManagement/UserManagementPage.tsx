import { useState } from "react";
import { UserList } from "~/components/UserList/UserList";
import { UserEditForm } from "~/components/UserForm/UserEditForm";
import { UserCreateForm } from "~/components/UserForm/UserCreateForm";

export default function UserManagementPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [mode, setMode] = useState<"view" | "create">("view");

  return (
    <div className="flex h-full">
      {/* Sidebar com busca e lista */}
      <UserList
        onSelectUser={(id) => {
          setSelectedUserId(id);
          setMode("view");
        }}
        onCreateUser={() => setMode("create")}
      />

      {/* Painel direito */}
      <div className="flex-1 p-4">
        {mode === "view" && <UserEditForm userId={selectedUserId} />}
        {mode === "create" && <UserCreateForm />}
      </div>
    </div>
  );
}
