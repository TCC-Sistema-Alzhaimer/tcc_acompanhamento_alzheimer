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
        "flex items-center gap-3 p-4 mx-2 my-1 rounded-xl cursor-pointer transition-all",
        selected
          ? "bg-teal-50 border border-teal-200"
          : "bg-gray-50 hover:bg-gray-100"
      )}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-teal-400 flex-shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
        <p className="text-sm text-gray-500">
          ID: #{user.id?.toString().padStart(5, "0")}
          {user.age && ` • ${user.age} anos`}
        </p>
      </div>

      {/* Arrow */}
      <div className="w-10 h-10 rounded-full bg-teal-400 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          strokeWidth="2.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
