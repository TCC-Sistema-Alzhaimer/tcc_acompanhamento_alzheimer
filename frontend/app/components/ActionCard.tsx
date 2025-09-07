import React from "react";

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function ActionCard({ title, icon, onClick, className }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        bg-white shadow-md rounded-lg
        hover:shadow-xl hover:scale-105 transition-all duration-200
        p-6 w-full sm:w-40 md:w-48 lg:w-52
        ${className || ""}
      `}
    >
      <div className="text-green-500 mb-2 text-4xl">{icon}</div>
      <span className="text-gray-800 font-medium text-center">{title}</span>
    </button>
  );
}
