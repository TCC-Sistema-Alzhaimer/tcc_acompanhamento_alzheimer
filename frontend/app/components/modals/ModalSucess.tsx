import React from "react";
import type { ReactNode } from "react";

type ModalSuccessProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
};

export default function ModalSuccess({ isOpen, onClose, title, children }: ModalSuccessProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 max-w-full text-center flex flex-col items-center">
        {/* Emoji de sucesso */}
        <span className="text-5xl mb-4">✅</span>

        {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
        {children && <p>{children}</p>}

        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
