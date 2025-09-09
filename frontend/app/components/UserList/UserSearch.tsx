import { useState } from "react";

interface UserSearchProps {
  onSearch: (term: string) => void;
}

export function UserSearch({ onSearch }: UserSearchProps) {
  const [term, setTerm] = useState("");

  const handleSearch = () => {
    onSearch(term);
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      <input
        type="text"
        placeholder="Buscar por nome ou email"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="p-2 rounded-md border border-gray-300"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Buscar
      </button>
    </div>
  );
}
