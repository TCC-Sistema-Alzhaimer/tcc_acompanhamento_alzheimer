interface ActionButtonProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
  title?: string;
}

function ActionButton({
  className,
  onClick,
  children,
  title,
}: ActionButtonProps) {
  return (
    <div
      className={`rounded-full w-[40px] h-[40px] cursor-pointer bg-white shadow-md ${className}`}
      title={title || ""}
      onClick={onClick}
    >
      <div className="h-full flex items-center justify-center text-green-500">
        {children}
      </div>
    </div>
  );
}

export default ActionButton;
