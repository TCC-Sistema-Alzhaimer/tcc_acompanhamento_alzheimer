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
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <FormControl fullWidth sx={{ margin: 0 }}>
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          displayEmpty
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #d1d5db",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #d1d5db",
            },
            "& .MuiSelect-select": {
              color: value ? "inherit" : "#9ca3af",
              padding: "8px",
            },
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            height: "38px",
            fontSize: "14px",
          }}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
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
