import { useAuth } from "@/hooks/useAuth";
import SearchUser from "./search-user";

interface TopbarProps {
  children: React.ReactNode;
}

export function Topbar({ children }: TopbarProps) {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between bg-green-500">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white pl-16">
          <p>Perfil: {user?.role}</p>
        </h2>
        <SearchUser />
      </div>
      <div className="flex flex-row items-center justify-end gap-3 pr-16 py-2">
        {children}
      </div>
    </div>
  );
}
