import { Outlet } from "react-router";
import { AuthGuard } from "~/guards/authGuard";

function PatientLayout() {
    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    )
}

export default PatientLayout;