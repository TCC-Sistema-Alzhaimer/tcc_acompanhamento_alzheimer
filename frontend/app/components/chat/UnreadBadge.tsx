import React from "react";

type ChatUnreadBadgeProps = {
  count: number;
  className?: string;
};

const MAX_COUNT_DISPLAY = 99;

export default function ChatUnreadBadge({
  count,
  className,
}: ChatUnreadBadgeProps) {
  if (!count || count <= 0) {
    return null;
  }

  const display = count > MAX_COUNT_DISPLAY ? "99+" : count;

  return (
    <span
      className={`pointer-events-none absolute top-0 right-0 flex min-h-5 min-w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-[#00a86b] px-1.5 py-0.5 text-xs font-semibold leading-none text-white shadow-md ${className ?? ""}`}
    >
      {display}
    </span>
  );
}
