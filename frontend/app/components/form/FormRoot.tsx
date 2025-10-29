interface FormRootProps {
    children: React.ReactNode;
    action?: string;
    method?: "POST" | "GET";
}

export function FormRoot({ children, action, method}: FormRootProps) {
    return  (
        <div> 
            <form className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100" action={action} method={method}>
                {children}
            </form>
        </div>
    )
}
