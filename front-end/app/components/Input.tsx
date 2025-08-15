import { useState } from "react";

interface InputProps {
    children?: React.ReactNode;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    onSearch?: (s: string) => void;
    className?: string;
    iconClassName?: string;
}

function Input({children, onChange, placeholder, icon, onSearch, className, iconClassName}: InputProps) {

    const [valueInput, setValueInput] = useState("");

    return (
        <div className="flex items-start flex-col w-full" >

            {children && (
                <label 
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    {children}
                </label>
            )}

            <div className="flex w-full gap-2">
                <input 
                    type="text" 
                    id="first_name" 
                    className={className}
                    placeholder={placeholder}
                    required 
                    onChange={(e) => {onChange; setValueInput(e.target.value)}}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && onSearch) {
                            onSearch(valueInput);
                        }
                    }}
                />


                {icon && (
                    <div className={iconClassName} onClick={() => onSearch?.(valueInput)}>
                        {icon}
                    </div>
                )
            }</div>

 
        </div>
    );
}

export default Input;