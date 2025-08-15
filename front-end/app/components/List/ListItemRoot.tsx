interface ListItemProps {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

function ListItemRoot({ children, active, onClick }: ListItemProps) {
    return (
        <div
            className={`flex items-center gap-4 rounded-lg border border-gray-100 transition-colors justify-between
            ${onClick ? "cursor-pointer" : ""}
            ${active ? "bg-gray-400" : ""}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default ListItemRoot;