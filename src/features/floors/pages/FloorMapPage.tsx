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

const FloorMapPage = () => {
  const { data: floors, isLoading, isError } = useFloors();
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");

  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (floors && floors.length > 0 && !selectedFloorId) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  const handleTableClick = (table: Table) => {
    if (!user) return;

    const rolePrefix = user.role === "MOZO" ? "/mozo" : "/caja";

    if (table.status === "LIBRE") {
      navigate(
        `${rolePrefix}/order/new?tableId=${
          table.id
        }&tableName=${encodeURIComponent(table.name)}&tableNumber=${
          table.number
        }`
      );
      return;
    }

    if (table.status === "OCUPADA") {
      if (rolePrefix === "/mozo") {
        navigate(
          `${rolePrefix}/table/${table.id}/detail?tableName=${
            table.name
          }&tableNumber=${table.number}&piso=${
            floors?.find((floor) => floor.id === selectedFloorId)?.name
          }`
        );
        return;
      }
      navigate(
        `${rolePrefix}/table/${table.id}/details?tableName=${
          table.name
        }&tableNumber=${table.number}&piso=${
          floors?.find((floor) => floor.id === selectedFloorId)?.name
        }`
      );

      return;
    }

    // --- CASO 3: PIDIENDO CUENTA (AMARILLA) ---
    if (table.status === "PIDIENDO_CUENTA") {
      if (user.role === "MOZO") {
        toast.info(
          `La Mesa ${table.number} está esperando el cobro. Avisa a Caja.`
        );
      } else {
        // ROL: CAJERO o ADMIN -> Acción: COBRAR
        // Opción A: Redirigir a la pantalla de detalles/facturación
        // navigate(`${rolePrefix}/table/${table.id}/details?action=pay`);

        // Opción B (Más rápida): Abrir Modal de Pago aquí mismo si tenemos el orderId
        // NOTA: Como la tabla 'table' del endpoint /floors a veces no trae el orderId,
        // lo ideal es ir a la página de detalles que carga la orden.
        // Pero si tu backend manda el activeOrderId en la mesa, úsalo aquí:

        // toast.success("Abriendo caja para cobrar...");
        navigate(`${rolePrefix}/table/${table.id}/details?action=pay`);
      }
      return;
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
