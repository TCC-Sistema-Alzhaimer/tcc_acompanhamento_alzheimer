// app/components/Form/FormSelect.tsx
import { Select, MenuItem, FormControl } from "@mui/material";
import type { SelectChangeEvent } from "node_modules/@mui/material";

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  label?: string;
  name: string;
  value: string | number;
  placeholder?: string;
  options: SelectOption[];
  onChange: (event: SelectChangeEvent<string | number>) => void;
}

export function FormSelect({
  label,
  name,
  value,
  placeholder,
  options,
  onChange,
}: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1 mb-4 w-full text-gray-700">
      {label && <label htmlFor={name}>{label}</label>}

      <FormControl fullWidth>
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          displayEmpty
          className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-200 bg-gray-100 border-none rounded-lg"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            height: "42px",
          }}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              <em>{placeholder}</em>
            </MenuItem>
          )}

          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
