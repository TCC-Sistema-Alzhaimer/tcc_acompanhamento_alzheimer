interface FormInputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormInput({
  label,
  name,
  type = "text",
  onChange,
  placeholder,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1 mb-4 w-full">
      {label && (
        <label htmlFor={name} style={{ display: "block" }}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 rounded-lg border-none text-black placeholder:text-gray-800"
      />
    </div>
  );
}
