import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-black">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
