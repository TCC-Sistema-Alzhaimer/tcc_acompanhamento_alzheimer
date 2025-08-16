import Input from "~/components/Input";

interface TopbarProps {
  children: React.ReactNode;
}

export function Topbar({ children }: TopbarProps) {
  return (
    <div className="flex items-center justify-between bg-primary">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white pl-16">
          <p>Perfil: Médico</p>
        </h2>
      </div>
      <div className="flex flex-row items-center justify-end gap-3 pr-16 py-2">{children}</div>
    </div>
  );
}
