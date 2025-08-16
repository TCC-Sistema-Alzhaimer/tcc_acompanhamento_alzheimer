import { Outlet } from "react-router";
import { AuthProvider } from "~/hooks/useAuth";

function AuthLayout() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-black">
            <AuthProvider>
                <Outlet />
            </AuthProvider>
        </div>
    )
}

export default AuthLayout;