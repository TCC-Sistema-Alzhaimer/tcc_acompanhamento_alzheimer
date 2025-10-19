import * as React from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { useAuth } from "~/hooks/useAuth";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

export default function AccountMenu() {
  const [open, setOpen] = React.useState(false);
  const { user, logout } = useAuth();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          {/* !TODO: Add user name if equals to figma */}
          <p className="text-white">{user?.email}</p>{" "}
          <Button
            variant="action"
            className="rounded-full w-[40px] h-[40px] shadow-md bg-white hover:bg-gray-100 text-gray-700"
          >
            <PermIdentityIcon />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="start">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
