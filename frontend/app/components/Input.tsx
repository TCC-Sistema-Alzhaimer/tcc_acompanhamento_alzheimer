import { IMaskInput } from "react-imask";

interface InputProps {
  children?: React.ReactNode;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mask?: string; // máscara opcional
  type?: string;
  className?: string;
}

export default function Input({
  children,
  value,
  placeholder,
  onChange,
  mask,
  type = "text",
  className,
}: InputProps) {
  return (
    <div className="flex flex-col w-full mb-3">
      {children && <label className="block mb-1 font-medium">{children}</label>}

      {mask ? (
        <IMaskInput
          type={type}
          mask={mask}
          value={value || ""}
          placeholder={placeholder}
          unmask={false}
          onAccept={(val: string) => {
            if (onChange) {
              // Simular evento de change para manter compatibilidade
              const syntheticEvent = {
                target: { value: val },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }
          }}
          className={`mt-1 w-full rounded-md border px-3 py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`mt-1 w-full rounded-md border px-3 py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
        />
      )}
    </div>
  );
}
