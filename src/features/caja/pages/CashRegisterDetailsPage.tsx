import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cashRegisterApi } from "../services/caja.service";

const CashRegisterDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cash-register-details", id],
    queryFn: () => cashRegisterApi.getDetails(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Cargando detalles de caja...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error al cargar</h2>
          <p className="text-muted-foreground mb-4">
            No se pudo cargar la información de esta caja
          </p>
        </Card>
      </div>
    );
  }

  const { cashRegister, totales, ventas, movimientos } = data;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Detalles de Caja</h1>
            <p className="text-muted-foreground">
              {format(new Date(cashRegister.openTime), "PPP", { locale: es })}
            </p>
          </div>
        </div>
        <Badge
          variant={cashRegister.status === "ABIERTA" ? "default" : "secondary"}
          className="text-lg px-4 py-2"
        >
          {cashRegister.status}
        </Badge>
      </div>

      {/* Información General */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Información General</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Cajero
            </p>
            <p className="text-lg font-semibold">{cashRegister.user.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Apertura
            </p>
            <p className="text-lg font-semibold">
              {format(new Date(cashRegister.openTime), "p", { locale: es })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {cashRegister.closeTime ? "Cierre" : "Duración"}
            </p>
            <p className="text-lg font-semibold">
              {cashRegister.closeTime
                ? format(new Date(cashRegister.closeTime), "p", { locale: es })
                : `${cashRegister.duracionHoras}h activa`}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duración Total</p>
            <p className="text-lg font-semibold">
              {cashRegister.duracionHoras} horas
            </p>
          </div>
        </div>
      </Card>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Monto Inicial</p>
          <p className="text-2xl font-bold">S/ {totales.inicial.toFixed(2)}</p>
        </Card>
        <Card className="p-4  border-green-200">
          <p className="text-sm  mb-2 flex items-center gap-2 text-green-400">
            <ShoppingCart className="h-4 w-4" />
            Ventas
          </p>
          <p className="text-2xl font-bold text-green-400">
            S/ {ventas.monto.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">{ventas.total} ventas</p>
        </Card>
        <Card className="p-4 border-blue-200">
          <p className="text-sm text-blue-400 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Ingresos Extra
          </p>
          <p className="text-2xl font-bold text-blue-400">
            S/ {totales.ingresosExtras.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {movimientos.ingresosExtras.length} registros
          </p>
        </Card>
        <Card className="p-4 border-red-200">
          <p className="text-sm text-red-400 mb-2 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Egresos
          </p>
          <p className="text-2xl font-bold text-red-400">
            S/ {totales.egresos.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {movimientos.egresos.length} gastos
          </p>
        </Card>
        <Card className="p-4 bg-primary/10 border-primary">
          <p className="text-sm text-muted-foreground mb-2">
            {cashRegister.status === "ABIERTA"
              ? "Balance Actual"
              : "Balance Final"}
          </p>
          <p className="text-2xl font-bold">S/ {totales.esperado.toFixed(2)}</p>
          {totales.diferencia !== null && totales.diferencia !== undefined && (
            <p
              className={`text-xs font-semibold ${
                totales.diferencia === 0
                  ? "text-green-600"
                  : totales.diferencia > 0
                    ? "text-blue-600"
                    : "text-red-600"
              }`}
            >
              Dif: S/ {Math.abs(totales.diferencia).toFixed(2)}
            </p>
          )}
        </Card>
      </div>

      {/* Ventas por Método de Pago */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Ventas por Método de Pago</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(ventas.porMetodo).map(
            ([method, data]: [string, any]) => (
              <div key={method} className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{method}</p>
                <p className="text-xl font-bold">S/ {data.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {data.count} {data.count === 1 ? "venta" : "ventas"}
                </p>
              </div>
            ),
          )}
        </div>
      </Card>

      {/* Tabs de Detalles */}
      <Tabs defaultValue="ventas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ventas">Ventas ({ventas.total})</TabsTrigger>
          <TabsTrigger value="ingresos">
            Ingresos Extra ({movimientos.ingresosExtras.length})
          </TabsTrigger>
          <TabsTrigger value="egresos">
            Egresos ({movimientos.egresos.length})
          </TabsTrigger>
          <TabsTrigger value="todos">Todos los Movimientos</TabsTrigger>
        </TabsList>

        {/* Tab Ventas */}
        <TabsContent value="ventas" className="mt-4">
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Hora</th>
                    <th className="text-left p-2">Comprobante</th>
                    <th className="text-left p-2">Cliente</th>
                    <th className="text-left p-2">Mesa</th>
                    <th className="text-left p-2">Método</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.listado.map((venta) => (
                    <tr key={venta.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        {format(new Date(venta.createdAt), "h:mm a", {
                          locale: es,
                        })}
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium">
                            {venta.numeroComprobante}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {venta.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{venta.cliente}</p>
                          <p className="text-xs text-muted-foreground">
                            {venta.clienteDoc}
                          </p>
                        </div>
                      </td>
                      {/* <td className="p-2">{venta.mesa}</td> */}
                      <td className="p-2">
                        <div>
                          {/* Mesa */}
                          <p className="font-medium">
                            {venta.metadata?.mesa || venta.mesa || "-"}
                          </p>

                          {/* Badge de División */}
                          {venta.metadata?.esDivision && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              División {venta.metadata.itemsPagados}/
                              {venta.metadata.totalItems} items
                            </Badge>
                          )}

                          {/* Número de Pedido */}
                          {venta.metadata?.orden && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Pedido #{venta.metadata.orden}
                            </p>
                          )}

                          {/* Mozo */}
                          {venta.metadata?.mozo && (
                            <p className="text-xs text-muted-foreground">
                              Mozo: {venta.metadata.mozo}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge>{venta.paymentMethod}</Badge>
                      </td>
                      <td className="p-2 text-right font-semibold">
                        S/ {venta.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab Ingresos Extra */}
        <TabsContent value="ingresos" className="mt-4">
          <Card className="p-6">
            <div className="space-y-3">
              {movimientos.ingresosExtras.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay ingresos extras registrados
                </p>
              ) : (
                movimientos.ingresosExtras.map((mov) => (
                  <div
                    key={mov.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{mov.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(mov.createdAt), "PPp", {
                            locale: es,
                          })}
                        </p>
                        {mov.metadata?.registeredBy && (
                          <p className="text-xs text-muted-foreground">
                            Por: {mov.metadata.registeredBy.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      + S/ {mov.amount.toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tab Egresos */}
        <TabsContent value="egresos" className="mt-4">
          <Card className="p-6">
            <div className="space-y-3">
              {movimientos.egresos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay egresos registrados
                </p>
              ) : (
                movimientos.egresos.map((mov) => (
                  <div
                    key={mov.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{mov.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(mov.createdAt), "PPp", {
                            locale: es,
                          })}
                        </p>
                        {mov.metadata?.registeredBy && (
                          <p className="text-xs text-muted-foreground">
                            Por: {mov.metadata.registeredBy.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      - S/ {mov.amount.toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tab Todos */}
        <TabsContent value="todos" className="mt-4">
          <Card className="p-6">
            <div className="space-y-2">
              {[
                ...movimientos.ventasAutomaticas.map((m) => ({
                  ...m,
                  categoria: "VENTA",
                })),
                ...movimientos.ingresosExtras.map((m) => ({
                  ...m,
                  categoria: "INGRESO",
                })),
                ...movimientos.egresos.map((m) => ({
                  ...m,
                  categoria: "EGRESO",
                })),
              ]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .map((mov) => (
                  <div
                    key={mov.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          mov.type === "INGRESO" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {mov.type === "INGRESO" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{mov.description}</p>
                        <div className="flex gap-2 items-center">
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(mov.createdAt), "PPp", {
                              locale: es,
                            })}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {mov.isAutomatic ? "Automático" : "Manual"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        mov.type === "INGRESO"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {mov.type === "INGRESO" ? "+" : "-"} S/{" "}
                      {mov.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashRegisterDetailsPage;
