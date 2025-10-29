import Sidebar from "~/components/Sidebar";
import { ROUTES } from "~/routes/EnumRoutes";

const navItems = [
  { label: "Início", to: ROUTES.PRIVATE_HOME },
  { label: "Pacientes", to: ROUTES.DOCTOR.PATIENTS },
  { label: "Exames", to: ROUTES.DOCTOR.EXAMINATION },
  { label: "Conclusões", to: ROUTES.DOCTOR.CONCLUSION },
];

function DoctorSideBar() {
  return (
    <Sidebar.Root>
      {navItems.map((item) => (
        <Sidebar.Option key={item.label} to={item.to}>
          {item.label}
        </Sidebar.Option>
      ))}

      <Sidebar.Option to={"/doctor/settings"}>Configurações</Sidebar.Option>
    </Sidebar.Root>
  );
}

export default DoctorSideBar;
