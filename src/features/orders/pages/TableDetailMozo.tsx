import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useActiveOrder, useDeactivateOrderItem } from "../hooks/useOrders";
import SpinnerLoading from "@/components/SpinnerLoading";
import {
  ArrowLeft,
  Clock,
  MapPin,
  UtensilsCrossed,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TableDetailMozo = () => {
  const { id: tableId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get("tableNumber");
  const piso = searchParams.get("piso");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data: order, isLoading, isError } = useActiveOrder(tableId!);
  const { mutate: deactivateItem, isPending: isDeletingItem } =
    useDeactivateOrderItem();

  const activeItems = order?.items.filter((item) => item.isActive) || [];

  const totalAmount = activeItems.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);

  if (isLoading) return <SpinnerLoading />;

  if (isError || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            No hay orden activa
          </h2>
          <p className="text-muted-foreground">
            Esta mesa no tiene pedidos en curso
          </p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Mapa
        </Button>
      </div>
    );
  }

  const handleAddItems = () => {
    navigate(
      `/mozo/order/new?tableId=${tableId}&tableName=${tableNumber}&orderId=${order.id}&tableNumber=${tableNumber}`,
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "secondary";
      case "EN_PROCESO":
        return "default";
      case "LISTO":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      deactivateItem(itemToDelete, {
        onSuccess: () => {
          setItemToDelete(null);
        },
      });
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="bg-card rounded-xl border shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <ArrowLeft
                  className="w-6 h-6 cursor-pointer text-muted-foreground"
                  onClick={() => navigate("/mozo/map")}
                />
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">
                    {`Mesa: ${tableNumber}`}
                  </h1>
                  <Badge
                    variant={getStatusVariant(order.status)}
                    className="uppercase text-xs"
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{piso}</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={handleAddItems}
                className="flex-1 gap-2"
                variant="secondary"
              >
                <Plus className="" />
                Agregar Pedido
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">
                Detalle del Pedido
              </h2>
              <Badge variant="outline" className="font-mono">
                {order.items.length}
                {order.items.length === 1 ? " item" : " items"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start justify-between p-1 transition-colors ${
                    !item.isActive
                      ? "opacity-50 bg-muted/50 line-through"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.isActive ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`font-bold ${
                          item.isActive
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`font-medium ${
                          item.isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.product.name}
                        {!item.isActive && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            ELIMINADO
                          </Badge>
                        )}
                      </p>
                      {item.variantsDetail && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                          {item.variantsDetail}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-secondary italic bg-secondary/10 px-2 py-1 rounded-md inline-block">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p
                        className={`font-semibold font-mono ${
                          item.isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        S/ {(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground font-mono">
                          S/ {Number(item.price).toFixed(2)} c/u
                        </p>
                      )}
                    </div>
                    {item.isActive && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={isDeletingItem}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t bg-muted/30">
            <span className="text-lg font-semibold text-foreground font-mono">
              Total a Pagar
            </span>
            <span className="text-2xl font-bold text-primary font-mono">
              S/ {totalAmount.toFixed(2)}
            </span>
          </CardFooter>
        </Card>
      </div>
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={() => setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este item?</AlertDialogTitle>
            <AlertDialogDescription>
              El item será marcado como eliminado y no se contará en el total.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default TableDetailMozo;
