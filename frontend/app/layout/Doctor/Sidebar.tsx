import Sidebar from "~/components/Sidebar";
import { ROUTES } from "~/routes/EnumRoutes";

const navItems = [
  { label: "Início", to: ROUTES.PRIVATE_HOME },
  { label: "Pacientes", to: ROUTES.DOCTOR.PATIENTS },
  { label: "Exames", to: ROUTES.DOCTOR.EXAMINATION },
  { label: "Conclusões", to: ROUTES.DOCTOR.CONCLUSION },
  { label: "Dashboard", to: ROUTES.DOCTOR.DASHBOARD },
];

function DoctorSideBar() {
  return (
    <Sidebar.Root>
      {navItems.map((item) => (
        <Sidebar.Option key={item.label} to={item.to}>
          {item.label}
        </Sidebar.Option>
      ))}
    </Sidebar.Root>
  );
}

export default DoctorSideBar;
