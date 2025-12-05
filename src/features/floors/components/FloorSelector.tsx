import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Floor } from "../types/floor.types";

interface Props {
  floors: Floor[];
}

const FloorSelector = ({ floors }: Props) => {
  return (
    <TabsList className="flex gap-2 p-6 rounded-xl bg-muted/40 dark:bg-muted/20 ">
      {floors.map((floor) => (
        <TabsTrigger
          key={floor.id}
          value={floor.id}
          className="flex-1 cursor-pointer rounded-lg px-3 py-4 font-medium text-sm transition-all border border-transparent shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary hover:bg-accent hover:text-accent-foreground dark:data-[state=active]:bg-primary dark:hover:bg-accent/30"
        >
          {floor.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default FloorSelector;
