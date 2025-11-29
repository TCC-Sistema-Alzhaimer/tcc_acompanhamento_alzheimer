import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, X, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles: Record<
  ToastType,
  { bg: string; border: string; icon: React.ReactNode }
> = {
  success: {
    bg: "bg-teal-50",
    border: "border-teal-400",
    icon: <CheckCircle size={20} className="text-teal-600" />,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-400",
    icon: <XCircle size={20} className="text-red-600" />,
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-400",
    icon: <AlertTriangle size={20} className="text-amber-600" />,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    icon: <Info size={20} className="text-blue-600" />,
  },
};

export function Toast({
  id,
  message,
  type,
  duration = 4000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const style = toastStyles[type];

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        ${style.bg} ${style.border}
        transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      {style.icon}
      <p className="text-sm font-medium text-gray-800 flex-1">{message}</p>
      <button
        onClick={handleClose}
        className="p-1 rounded hover:bg-gray-200/50 transition-colors"
      >
        <X size={16} className="text-gray-700" />
      </button>
    </div>
  );
}

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
