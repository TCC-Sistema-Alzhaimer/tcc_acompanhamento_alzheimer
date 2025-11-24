import { Link, type LinkProps } from "react-router-dom";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "dashed" | "danger" | "ghost";

interface ButtonProps {
  to?: LinkProps["to"];
  type?: "submit" | "reset" | "button";
  children: React.ReactNode;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
}

function Button({
  to,
  type,
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-semibold text-center transition-colors duration-200";

  let variantClasses = "";
  switch (variant) {
    case "secondary":
      variantClasses = `
        w-full px-4 py-3 bg-white border-2 border-teal-600 text-teal-600 
        ${!disabled ? "hover:bg-teal-50" : ""}
      `;
      break;
    case "dashed":
      variantClasses = `
        w-full px-4 py-3 bg-white border-2 border-dashed border-teal-600 text-teal-600 
        ${!disabled ? "hover:bg-teal-50" : ""}
      `;
      break;
    case "danger":
      variantClasses = `
        w-full px-4 py-3 bg-red-600 text-white border-2 border-red-700
        ${!disabled ? "hover:bg-red-700" : ""}
      `;
      break;

    case "ghost":
      variantClasses = `
        bg-transparent
        ${!disabled ? "hover:bg-transparent" : ""}
      `;
      break;

    case "primary":
    default:
      variantClasses = `
        w-full px-4 py-3 bg-teal-600 text-white 
        ${!disabled ? "hover:bg-teal-700" : ""}
      `;
      break;
  }

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  const classes = `${baseClasses} ${variantClasses} ${disabledClasses} ${className}`;

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  if (to) {
    return (
      <Link to={to} onClick={handleClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}

export default Button;
