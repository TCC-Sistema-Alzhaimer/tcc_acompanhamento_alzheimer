import { useEffect, useState } from "react";
import type {
  AdminModel,
  DoctorModel,
  PatientModel,
  CaregiverModel,
} from "~/types/roles/models";
import Button from "~/components/Button"; // se você estiver usando shadcn/ui

type UserFullModel = AdminModel | DoctorModel | PatientModel | CaregiverModel;

interface UserEditFormProps {
  userId: number | null;
}

export function UserEditForm({ userId }: UserEditFormProps) {
  const [user, setUser] = useState<UserFullModel | null>(null);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => setUser(data));
    }
  }, [userId]);

  if (!user) return <div className="p-4">Selecione um usuário</div>;

  return (
    <div className="flex flex-col items-center justify-start p-3 w-full rounded-2xl shadow-2xl bg-white">
      <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>

      {/* Exemplo de campos */}
      <input
        type="text"
        value={user.name}
        className="p-2 mb-2 border rounded w-full"
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />

      <input
        type="email"
        value={user.email}
        className="p-2 mb-2 border rounded w-full"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <Button onClick={() => console.log("Salvar", user)}>Salvar</Button>
    </div>
  );
}
