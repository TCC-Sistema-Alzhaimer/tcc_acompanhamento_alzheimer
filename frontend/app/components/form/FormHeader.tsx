interface FormHeaderProps {
    title: string;
    subtitle?: string;
}

export function FormHeader({ title, subtitle }: FormHeaderProps) {
    return (
        <div className="flex flex-col gap-2 mb-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
    );
}
