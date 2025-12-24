import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type DateRange } from "react-day-picker";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Eye, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { cashRegisterApi } from "../services/caja.service";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export const CashRegisterHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: history, isLoading } = useQuery({
    queryKey: ["cash-register", "history", dateRange],
    queryFn: () => {
      if (dateRange?.from && dateRange?.to) {
        const days = Math.ceil(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return cashRegisterApi.getHistory(
          days,
          dateRange.from.toISOString(),
          dateRange.to.toISOString()
        );
      }
      return cashRegisterApi.getHistory(30);
    },
  });

  const handleClearFilters = () => {
    setDateRange(undefined);
  };

  if (!history && !isLoading) return null;

  const chartData = history
    ?.filter((cr) => cr.status === "CERRADA")
    .reverse()
    .map((cr) => ({
      date: new Date(cr.openTime).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
      }),
      sistema: parseFloat(cr.systemMoney?.toString() || "0"),
      contado: parseFloat(cr.finalMoney?.toString() || "0"),
      diferencia: parseFloat(cr.difference?.toString() || "0"),
    }));

  // Filtrar por rango de fechas en el frontend
  const filteredHistory = history?.filter((cr) => {
    if (!dateRange?.from && !dateRange?.to) return true;

    const crDate = new Date(cr.openTime);
    crDate.setHours(0, 0, 0, 0);

    if (dateRange.from && dateRange.to) {
      const from = new Date(dateRange.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(dateRange.to);
      to.setHours(23, 59, 59, 999);
      return crDate >= from && crDate <= to;
    }

    if (dateRange.from) {
      const from = new Date(dateRange.from);
      from.setHours(0, 0, 0, 0);
      return crDate >= from;
    }

    return true;
  });

  const goToDetails = (id: string) => {
    if (!user) {
      return;
    }
    const route = user.role === "CAJERO" ? "caja" : "admin";
    navigate(`/${route}/cash-register/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Historial de Cajas</h2>

        <div className="flex gap-2">
          {/* Filtro de rango de fechas */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange?.from && !dateRange?.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange?.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: es })
                  )
                ) : (
                  "Filtrar por fecha"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                locale={es}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {(dateRange?.from || dateRange?.to) && (
            <Button variant="ghost" size="icon" onClick={handleClearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {(dateRange?.from || dateRange?.to) && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {filteredHistory?.length || 0} resultados encontrados
          </Badge>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Cargando historial...</div>
      ) : (
        <>
          {/* Gráfica */}
          {chartData && chartData.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {dateRange?.from && dateRange?.to
                  ? `Del ${format(dateRange.from, "dd/MM/yyyy")} al ${format(
                      dateRange.to,
                      "dd/MM/yyyy"
                    )}`
                  : "Últimos 30 días"}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sistema"
                    stroke="#8884d8"
                    name="Sistema"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="contado"
                    stroke="#82ca9d"
                    name="Contado"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Tabla */}
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Fecha</th>
                    <th className="text-left p-2">Cajero</th>
                    <th className="text-right p-2">Inicial</th>
                    <th className="text-right p-2">Sistema</th>
                    <th className="text-right p-2">Contado</th>
                    <th className="text-center p-2">Diferencia</th>
                    <th className="text-center p-2">Estado</th>
                    <th className="text-center p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No hay registros en este rango de fechas
                      </td>
                    </tr>
                  ) : (
                    filteredHistory?.map((cr) => (
                      <tr key={cr.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          {new Date(cr.openTime).toLocaleDateString("es-PE")}
                        </td>
                        <td className="p-2">{cr.user.name}</td>
                        <td className="p-2 text-right">
                          S/ {parseFloat(cr.initialMoney.toString()).toFixed(2)}
                        </td>
                        <td className="p-2 text-right">
                          {cr.systemMoney
                            ? `S/ ${parseFloat(
                                cr.systemMoney.toString()
                              ).toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="p-2 text-right">
                          {cr.finalMoney
                            ? `S/ ${parseFloat(
                                cr.finalMoney.toString()
                              ).toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="p-2 text-center">
                          {cr.difference && (
                            <span
                              className={
                                parseFloat(cr.difference.toString()) === 0
                                  ? "text-green-600 font-semibold"
                                  : parseFloat(cr.difference.toString()) > 0
                                  ? "text-blue-600 font-semibold"
                                  : "text-red-600 font-semibold"
                              }
                            >
                              S/{" "}
                              {Math.abs(
                                parseFloat(cr.difference.toString())
                              ).toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          <Badge
                            variant={
                              cr.status === "ABIERTA" ? "default" : "secondary"
                            }
                          >
                            {cr.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => goToDetails(cr.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (!user) return;
                              const route =
                                user.role === "CAJERO" ? "caja" : "admin";
                              navigate(`/${route}/cash-register/${cr.id}/pdf`);
                            }}
                            title="Ver PDF"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
