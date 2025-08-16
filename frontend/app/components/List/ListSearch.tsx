import Input from "../Input";

interface ListSearchProps {
  children?: React.ReactNode;
  onSearch?: (s: string) => void;
  placeholder?: string;
}

function ListSearch({ children, onSearch, placeholder }: ListSearchProps) {
  return (
    <div className="flex items-center justify-between border gra rounded-lg p-4 border-gray-100">
      <Input
        icon={children}
        onSearch={onSearch}
        placeholder={placeholder || "Buscar pacientes..."}
        className="text-gray-800 bg-gray-200 rounded-4xl px-6 py-1.5 w-full "
        iconClassName="mt-2 cursor-pointer bg-green-500 rounded-full p-2 text-white shadow-md"
      />
    </div>
  );
}

export default ListSearch;
