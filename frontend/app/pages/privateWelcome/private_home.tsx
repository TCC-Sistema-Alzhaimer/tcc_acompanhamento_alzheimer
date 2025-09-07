import { useAuth } from "~/hooks/useAuth";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ActionCard from "~/components/ActionCard";

export default function PrivateHome() {
  const { user } = useAuth();

  const actions = [];

  if (user?.role === "ADMINISTRATOR") {
    actions.push(
      { title: "Gerenciar Usuários", icon: <PeopleIcon /> },
      { title: "Relatórios", icon: <DescriptionIcon /> }
    );
  }

  if (user?.role === "DOCTOR") {
    actions.push(
      { title: "Registrar Exame", icon: <AssignmentIcon /> },
      { title: "Consultar Pacientes", icon: <PeopleIcon /> }
    );
  }

  if (user?.role === "CAREGIVER") {
    actions.push(
      { title: "Meus Pacientes", icon: <PeopleIcon /> },
      { title: "Agendar Exames", icon: <EventAvailableIcon /> }
    );
  }

  return (
    <div className="flex items-center justify-center flex-col gap-8 p-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Bem-vindo(a), {user?.email || "usuário"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {actions.map((action) => (
          <ActionCard
            key={action.title}
            title={action.title}
            icon={action.icon}
            onClick={() => console.log(`Clicked ${action.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
