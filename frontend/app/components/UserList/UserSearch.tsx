import { useState, useEffect } from "react";

interface UserSearchProps {
  onSearch: (term: string) => void;
}

export function UserSearch({ onSearch }: UserSearchProps) {
  const [term, setTerm] = useState("");

  // Busca automática com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(term);
    }, 300);

    return () => clearTimeout(timer);
  }, [term, onSearch]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar pacientes..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-400 focus:outline-none transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
    </div>
  );
}
