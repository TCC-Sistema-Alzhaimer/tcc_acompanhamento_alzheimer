import { patients } from "~/mocks/mock";

interface ListRootProps {
  children: React.ReactNode;
}

function ListRoot({ children }: ListRootProps) {
  return <div className="flex flex-col w-full gap-3 h-full ">{children}</div>;
}

export default ListRoot;
