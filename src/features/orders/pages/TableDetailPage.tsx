import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Receipt,
  DollarSign,
  Clock,
  Split,
  UtensilsCrossed,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import SpinnerLoading from "@/components/SpinnerLoading";
import { PaymentModal } from "@/features/billing/components/PaymentModal";
import { useState, useEffect } from "react";
import { useActiveOrder, useRequestPreCount } from "../hooks/useOrders";

export default function TableDetailPage() {
  const { id: tableId } = useParams(); // ID de la mesa desde la URL
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const tableName = searchParams.get("tableName");
  // const tableNumber = searchParams.get("tableNumber");
  const piso = searchParams.get("piso");

  // Estado para el modal de cobro (Solo Cajeros)
  const [paymentOpen, setPaymentOpen] = useState(false);
  const action = searchParams.get("action"); // ?action=pay

  // Hooks de Datos
  const { data: order, isLoading, isError } = useActiveOrder(tableId!);
  const { mutate: preCount, isPending: loadingPreCount } = useRequestPreCount();

  // Abrir modal automáticamente si la URL lo dice (Redirección desde Mapa Amarillo)
  useEffect(() => {
    if (action === "pay" && order && !paymentOpen) {
      setPaymentOpen(true);
    }
  }, [action, order]);

  // Cálculo del Total Local (Si el backend no lo manda sumado)
  const totalAmount =
    order?.items.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity;
    }, 0) || 0;

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

  const handlePreAccount = () => {
    if (confirm("¿Solicitar pre-cuenta y cambiar estado a amarillo?")) {
      preCount(order.id);
    }
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

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-3">
        {/* Header Section */}
        <div className="bg-card rounded-xl border shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Table Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">
                    {tableName}
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
                  <span className="text-border">•</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {user?.role === "MOZO" && (
                <Button
                  onClick={handlePreAccount}
                  disabled={loadingPreCount}
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <Receipt className="w-4 h-4" />
                  {loadingPreCount ? "Solicitando..." : "Pre-Cuenta"}
                </Button>
              )}

              {(user?.role === "CAJERO" || user?.role === "ADMIN") && (
                <>
                  <Button
                    onClick={() => setPaymentOpen(true)}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <DollarSign className="w-4 h-4" />
                    Cobrar Mesa
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => navigate(`/caja/table/${tableId}/split`)}
                  >
                    <Split className="w-4 h-4" />
                    Dividir
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order Items Card */}
        <Card className="">
          <CardHeader className="">
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
                  className="flex items-start justify-between p-1 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {item.product.name}
                      </p>

                      {item.variantsDetail && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                          {item.variantsDetail}
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-sm text-amber-600 dark:text-amber-500 italic bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md inline-block">
                          📝 {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-foreground font-mono">
                      S/ {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground font-mono">
                        S/ {Number(item.price).toFixed(2)} c/u
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Totals Footer */}
          <CardFooter className="flex flex-col p-0 border-t bg-muted/30">
            <div className="w-full p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-mono">
                  Subtotal
                </span>
                <span className="font-medium font-mono">
                  S/ {(totalAmount / 1.18).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-mono">
                  IGV (18%)
                </span>
                <span className="font-medium font-mono">
                  S/ {(totalAmount - totalAmount / 1.18).toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-1">
                <span className="text-lg font-semibold text-foreground font-mono">
                  Total a Pagar
                </span>
                <span className="text-2xl font-bold text-primary font-mono">
                  S/ {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Payment Modal */}
      {(user?.role === "CAJERO" || user?.role === "ADMIN") && (
        <PaymentModal
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          orderId={order.id}
          totalAmount={totalAmount}
        />
      )}
    </>
  );
}
