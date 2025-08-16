interface ListItemProps {
    title: string;
    description: string;
    className?: string;
}

function ListItemContent({ title, description, className }: ListItemProps) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="flex flex-row gap-2 text-gray-900">{description}</p>
        </div>
    );
}

export default ListItemContent;