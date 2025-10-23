import { useAuth } from "@/hooks/useAuth";
import SearchUser from "./search-user";
import Input from "~/components/Input";
import { ROUTES } from "~/routes/EnumRoutes";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";

interface TopbarProps {
  children: React.ReactNode;
}

export function Topbar({ children }: TopbarProps) {


  return (
    <div className="flex items-center justify-between bg-green-500">
      <div className="flex items-center gap-4">
        <SearchUser />
      </div>
      <div className="flex flex-row items-center justify-end gap-3 pr-16 py-2">
        {children}
      </div>
    </div>
  );
}
