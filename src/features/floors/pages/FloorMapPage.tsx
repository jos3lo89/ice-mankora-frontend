import { useState, useEffect } from "react";
import { useFloors } from "../hooks/useFloors";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { type Table } from "../types/floor.types";
import { toast } from "sonner";
import TableItem from "../components/TableItem";
import { useNavigate } from "react-router-dom";
import SpinnerLoading from "@/components/SpinnerLoading";
import FloorSelector from "../components/FloorSelector";

const FloorMapPage = () => {
  const { data: floors, isLoading, isError } = useFloors();
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (floors && floors.length > 0 && !selectedFloorId) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  const handleTableClick = (table: Table) => {
    if (table.status === "LIBRE") {
      navigate(`/mozo/order/new?tableId=${table.id}`);
    } else if (table.status === "PIDIENDO_CUENTA") {
      toast.warning(`La Mesa ${table.number} quiere pagar.`);
    } else {
      toast.success(`Mesa ${table.number} ocupada. Ver detalle.`);
    }
  };

  if (isLoading) return <SpinnerLoading />;

  if (isError)
    return <div className="text-red-500 text-center">Error cargando pisos</div>;

  return (
    <div className="space-y-6">
      {floors && (
        <Tabs
          value={selectedFloorId}
          onValueChange={setSelectedFloorId}
          className="w-full"
        >
          <FloorSelector floors={floors} />

          {floors.map((floor) => (
            <TabsContent key={floor.id} value={floor.id} className="">
              <Card className="p-6">
                {floor.tables.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No hay mesas en este piso.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {floor.tables.map((table) => (
                      <TableItem
                        key={table.id}
                        table={table}
                        onClick={handleTableClick}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default FloorMapPage;
