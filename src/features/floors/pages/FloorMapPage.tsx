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
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useRefreshQuery } from "@/utils/queryUtils";

const FloorMapPage = () => {
  const { data: floors, isLoading, isError } = useFloors();
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { refreshQuery, isRefreshing } = useRefreshQuery();

  useEffect(() => {
    if (floors && floors.length > 0 && !selectedFloorId) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  const handleTableClick = (table: Table) => {
    if (!user) {
      toast.error("Usuario no autenticado");
      return;
    }

    const rolePrefix = user.role === "MOZO" ? "/mozo" : "/caja";

    if (table.status === "LIBRE") {
      navigate(
        `${rolePrefix}/order/new?tableId=${table.id}&tableNumber=${table.number}`
      );
      return;
    }

    if (table.status === "OCUPADA") {
      if (rolePrefix === "/mozo") {
        navigate(
          `${rolePrefix}/table/${table.id}/detail?tableNumber=${
            table.number
          }&piso=${floors?.find((floor) => floor.id === selectedFloorId)?.name}`
        );
        return;
      }
      navigate(
        `${rolePrefix}/table/${table.id}/details?tableName=${
          table.id
        }&tableNumber=${table.number}&piso=${
          floors?.find((floor) => floor.id === selectedFloorId)?.name
        }`
      );

      return;
    }

    if (table.status === "PIDIENDO_CUENTA") {
      if (user.role === "MOZO") {
        toast.info(
          `La Mesa ${table.number} está esperando el cobro. Avisa a Caja.`
        );
      } else {
        navigate(`${rolePrefix}/table/${table.id}/details?action=pay`);
      }
      return;
    }
  };

  if (isLoading) return <SpinnerLoading />;

  if (isError) {
    return <div className="text-red-500 text-center">Error cargando pisos</div>;
  }

  return (
    <div className="space-y-6">
      {floors && (
        <Tabs value={selectedFloorId} onValueChange={setSelectedFloorId}>
          <div className="flex justify-center items-center gap-2 ">
            <FloorSelector floors={floors} />
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => refreshQuery("floors")}
              disabled={isRefreshing}
            >
              <RefreshCcw className={isRefreshing ? "animate-spin" : ""} />
            </Button>
          </div>

          {floors.map((floor) => (
            <TabsContent key={floor.id} value={floor.id}>
              <Card className="p-5">
                {floor.tables.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No hay mesas en este piso.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-center">
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
