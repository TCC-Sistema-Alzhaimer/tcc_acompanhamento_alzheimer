import type { BasicListModel } from "~/types/roles/models";
import clsx from "clsx";

interface UserListItemProps {
  user: BasicListModel;
  selected: boolean;
  onClick: () => void;
}

export function UserListItem({ user, selected, onClick }: UserListItemProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "p-3 rounded-lg cursor-pointer transition-colors",
        selected ? "bg-gray-300" : "hover:bg-gray-200"
      )}
    >
      <p className="text-sm text-black-500">{user.userType}</p> 
      <p className="font-semibold">{user.name}</p>
      <p className="text-sm text-gray-600">{user.email}</p>
    </div>
  );
}
