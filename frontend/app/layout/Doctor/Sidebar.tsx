import Sidebar from "~/components/Sidebar";

function DoctorSideBar() {
    return (
        <Sidebar.Root>
            <Sidebar.Option onClick={() => {}} isActive={true}>Inicio</Sidebar.Option>
            <Sidebar.Option onClick={() => {}}>Exames</Sidebar.Option>
            <Sidebar.Option onClick={() => {}}>Pacientes</Sidebar.Option>
            <Sidebar.Option onClick={() => {}}>Configurações</Sidebar.Option>
        </Sidebar.Root>
    )
}

export default DoctorSideBar;