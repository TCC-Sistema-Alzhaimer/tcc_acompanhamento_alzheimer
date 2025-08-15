import { Circle } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { Caregiver, Doctor, Patient } from "~/types/Users";

interface ListItemProps {
  item: any;
  active?: boolean;
  onClick?: (c: any) => void;
}

function ListItem({ item, active, onClick }: ListItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border border-gray-100 transition-colors justify-between
    ${onClick ? "cursor-pointer" : ""}
    ${active ? "bg-gray-400" : ""}
  `}
      onClick={() => onClick?.(item.id)}
    >
      <div className="flex items-center gap-4">
        <div className="w-[38px] h-[38px] bg-green-500 rounded-full shadow-md"></div>
        <div className="flex text-dark-100 flex-col">
          <p className="font-bold text-lg">{item.name || item.title}</p>
          <div className="flex flex-row gap-2 text-gray-900">
            <p>ID: #{item.id}</p>•
            {"birthdate" in item && (
              <p>
                {(() => {
                  const birth = new Date(item.birthdate);
                  const today = new Date();
                  let age = today.getFullYear() - birth.getFullYear();
                  const m = today.getMonth() - birth.getMonth();

                  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                    age--;
                  }

                  return `${age} anos`;
                })()}
              </p>
            )}
          </div>
        </div>
      </div>
      {active && (
        <div className="flex items-center">
          <ArrowForwardIcon className="text-white bg-green-500 p-1 rounded-full shadow-md" sx={{fontSize: "38px"}}/>
        </div>
      )}
    </div>
  );
}

export default ListItem;
