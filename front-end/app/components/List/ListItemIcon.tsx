interface ListItemProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

function ListItemIcon({ children, className, onClick }: ListItemProps) {
    return (
        <div className={`flex flex-col gap-2 p-4 ${className}`} onClick={onClick}>
            {children}
        </div>
    );
}

export default ListItemIcon;