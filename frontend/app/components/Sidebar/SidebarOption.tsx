interface OptionBarProps {
  children: string;
  onClick: () => void;
  isActive?: boolean;
}

function SidebarOption({ children, onClick, isActive }: OptionBarProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-3 px-5 cursor-pointer rounded-xl mb-2 text-black shadow-md ${
        !isActive ? "bg-white" : "bg-green-500"
      }`}
    >
      <div>
        <div
          className={`shadow-md rounded-full w-[24px] h-[24px] ${
            !isActive ? "bg-green-500" : "bg-white"
          }`}
        ></div>
      </div>
      <p className={`font-bold text-lg ${!isActive ? "text-gray-800" : "text-white"}`}>
        {children}
      </p>
    </div>
  );
}

export default SidebarOption;
