import { useState } from "react";
import { UserList } from "~/components/UserList/UserList";
import { UserEditForm } from "~/components/UserForm/UserEditForm";
import { UserCreateForm } from "~/components/UserForm/UserCreateForm";
import { SystemRoles } from "~/types/SystemRoles";

export default function UserManagementPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<SystemRoles | "">("");
  const [mode, setMode] = useState<"view" | "create">("view");

  return (
    <div className="flex h-full">
      <UserList
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

