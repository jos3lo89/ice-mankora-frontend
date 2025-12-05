import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Floor } from "../types/floor.types";

interface Props {
  floors: Floor[];
}

const FloorSelector = ({ floors }: Props) => {
  return (
    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
      {floors.map((floor) => (
        <TabsTrigger
          key={floor.id}
          value={floor.id}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          {floor.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
export default FloorSelector;
