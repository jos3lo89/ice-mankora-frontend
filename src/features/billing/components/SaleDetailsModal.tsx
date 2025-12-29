import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Receipt,
  User,
  Calendar,
  CreditCard,
  MapPin,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import SpinnerLoading from "@/components/SpinnerLoading";
import { useSaleDetails } from "../hooks/seBilling";

interface SaleDetailsModalProps {
  open: boolean;
  onClose: () => void;
  saleId: string | null;
}

export const SaleDetailsModal = ({
  open,
  onClose,
  saleId,
}: SaleDetailsModalProps) => {
  const { data, isLoading } = useSaleDetails(saleId);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <SpinnerLoading />
          </div>
        ) : data ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Receipt className="h-6 w-6" />
                <div>
                  <p className="text-2xl font-bold">
                    {data.sale.numeroComprobante}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Detalles de la Venta
                  </p>
                </div>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Información General */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Receipt className="h-3 w-3" />
                    Tipo
                  </p>
                  <Badge variant="outline">{data.sale.type}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fecha
                  </p>
                  <p className="text-sm font-medium">
                    {format(new Date(data.sale.fechaEmision), "PPp", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    Método de Pago
                  </p>
                  <Badge>{data.sale.paymentMethod}</Badge>
                </div>
                {/* <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Estado SUNAT</p>
                  <Badge
                    variant={
                      data.sale.sunatStatus === "ACEPTADO"
                        ? "default"
                        : data.sale.sunatStatus === "NO_APLICA"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {data.sale.sunatStatus}
                  </Badge>
                </div> */}
              </div>

              <Separator />

              {/* Cliente, Cajero, Mesa */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Cliente */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="font-medium">
                      {data.sale.cliente?.name || "CLIENTE VARIOS"}
                    </p>
                    {data.sale.cliente && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          {data.sale.cliente.docType}:{" "}
                          {data.sale.cliente.docNumber}
                        </p>
                        {data.sale.cliente.address && (
                          <p className="text-xs text-muted-foreground">
                            {data.sale.cliente.address}
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Cajero */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Cajero
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="font-medium">{data.sale.cajero.name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{data.sale.cajero.username}
                    </p>
                  </CardContent>
                </Card>

                {/* Mesa y Orden */}
                {data.sale.orden && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4" />
                        Mesa / Orden
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <p className="font-medium">{data.sale.orden.mesa.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {data.sale.orden.mesa.piso}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pedido #{data.sale.orden.dailyNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mozo: {data.sale.orden.mozo.name}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Items Vendidos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Productos Cobrados
                  </h3>
                  <Badge variant="outline">
                    {data.items.activos.length} items
                  </Badge>
                </div>

                <div className="space-y-2">
                  {data.items.activos.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">
                            {item.quantity}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          {/* ✅ Categoría opcional */}
                          {item.categoryName && (
                            <p className="text-xs text-muted-foreground">
                              {item.categoryName}
                            </p>
                          )}
                          {item.variantsDetail && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.variantsDetail}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-sm italic text-secondary mt-1">
                              Nota: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          S/ {item.subtotal.toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            S/ {item.price.toFixed(2)} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {data.items.inactivos.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2 text-muted-foreground">
                        <XCircle className="h-5 w-5" />
                        Productos Eliminados (No Cobrados)
                      </h3>
                      <Badge variant="destructive">
                        {data.items.inactivos.length} items
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {data.items.inactivos.map((item: any) => (
                        <div
                          key={item.productId}
                          className="flex items-start justify-between p-3 bg-muted/50 rounded-lg opacity-60 line-through"
                        >
                          <div className="flex gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <span className="font-bold text-muted-foreground">
                                {item.quantity}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">
                                {item.productName}
                              </p>
                              <Badge variant="destructive" className="mt-1">
                                ELIMINADO
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-muted-foreground">
                              S/ {item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Totales */}
              <Card className="bg-primary/5">
                <CardContent className="p-4 space-y-3">
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor Venta</span>
                    <span className="font-medium">
                      S/ {data.sale.valorVenta.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IGV (18%)</span>
                    <span className="font-medium">
                      S/ {data.sale.igv.toFixed(2)}
                    </span>
                  </div> */}
                  {/* <Separator /> */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">
                      S/ {data.sale.precioVentaTotal.toFixed(2)}
                    </span>
                  </div>

                  {data.sale.montoPagado && (
                    <>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pagado</span>
                        <span className="font-medium">
                          S/ {data.sale.montoPagado.toFixed(2)}
                        </span>
                      </div>
                      {data.sale.vuelto && data.sale.vuelto > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Vuelto</span>
                          <span className="font-medium text-green-600">
                            S/ {data.sale.vuelto.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Metadata adicional */}
              {data.sale.metadata?.esDivision && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-blue-800">
                      ℹ️ Esta venta fue parte de una división de cuenta
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {data.sale.metadata.itemsPagados} de{" "}
                      {data.sale.metadata.totalItems} items cobrados
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Timestamp */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  Registrado el{" "}
                  {format(new Date(data.sale.createdAt), "PPpp", {
                    locale: es,
                  })}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              No se pudo cargar la información de la venta
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
