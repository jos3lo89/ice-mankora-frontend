import { cn } from "@/lib/utils";
import { type Table, TableStatus } from "../types/floor.types";

interface Props {
  table: Table;
  onClick: (table: Table) => void;
}

const TableItem = ({ table, onClick }: Props) => {
  const statusColor = {
    [TableStatus.LIBRE]: "bg-green-500 hover:bg-green-600 text-white",
    [TableStatus.OCUPADA]: "bg-red-500 hover:bg-red-600 text-white",
    [TableStatus.PIDIENDO_CUENTA]:
      "bg-yellow-400 hover:bg-yellow-500 text-black",
    [TableStatus.SUCIA]: "bg-gray-400 hover:bg-gray-500 text-white",
  };

  return (
    <button
      onClick={() => onClick(table)}
      className={cn(
        "rounded-xl shadow-md transition-all transform hover:scale-105 flex flex-col items-center justify-center p-4 w-32 h-32",
        statusColor[table.status]
      )}
    >
      <span className="text-2xl font-bold">{table.number}</span>
      <span className="text-xs uppercase font-semibold mt-1">
        {table.status.replace("_", " ")}
      </span>
    </button>
  );
};

export default TableItem;
