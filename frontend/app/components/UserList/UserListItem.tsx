import type { BasicListModel } from "~/types/roles/models";
import clsx from "clsx";

interface UserListItemProps {
  user: BasicListModel;
  selected: boolean;
  onClick: () => void;
}

export function UserListItem({ user, selected, onClick }: UserListItemProps) {
  const userInitials = user.name ? user.name.slice(0, 2).toUpperCase() : "??";

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <div
        className={clsx(
          "flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 transition",
          selected
            ? "border-teal-200 bg-teal-50"
            : "border-transparent bg-gray-50 hover:bg-gray-100"
        )}
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-teal-400 text-xs font-semibold uppercase text-white">
          {userInitials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {user.name}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            ID: #{user.id?.toString().padStart(5, "0")}
          </p>
        </div>

        <div className="w-11 h-11 rounded-full bg-teal-400 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            strokeWidth="2.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
