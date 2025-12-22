import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCashRegister } from "../hooks/useCashRegister";
import { cashRegisterApi } from "../services/caja.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropagateLoader } from "react-spinners";

interface Props {
  open: boolean;
  onClose: () => void;
  cashRegisterId: string;
}

export const CloseCashRegisterModal = ({
  open,
  onClose,
  cashRegisterId,
}: Props) => {
  const [finalMoney, setFinalMoney] = useState("");
  const { closeCashRegister, isClosing } = useCashRegister();

  const { data: summary, isLoading } = useQuery({
    queryKey: ["cash-register", cashRegisterId, "summary"],
    queryFn: () => cashRegisterApi.getSummary(cashRegisterId),
    enabled: open,
  });

  const systemMoney = summary?.systemMoney || 0;
  const finalMoneyNum = parseFloat(finalMoney) || 0;
  const difference = finalMoneyNum - systemMoney;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    closeCashRegister(
      { id: cashRegisterId, finalMoney: finalMoneyNum },
      {
        onSuccess: () => {
          onClose();
          setFinalMoney("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cerrar Caja</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <PropagateLoader size={8} color="#3b82f6" />
            </div>
          ) : (
            <>
              <div className="p-4  rounded-lg border-2">
                <p className="text-sm font-medium text-blue-700 mb-2">
                  Cálculo del Sistema:
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Inicial:</span>
                    <span className="font-mono">
                      S/ {summary?.breakdown.inicial.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>+ Ventas:</span>
                    <span className="font-mono">
                      S/ {summary?.breakdown.ventas.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-blue-700">
                    <span>+ Ingresos Extra:</span>
                    <span className="font-mono">
                      S/ {summary?.breakdown.ingresosExtra.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-700">
                    <span>- Egresos:</span>
                    <span className="font-mono">
                      S/ {summary?.breakdown.egresos.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t-2 border-blue-300 pt-1 mt-1"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="font-mono">
                      S/ {systemMoney.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <p className="text-sm text-muted-foreground">
                  Monto Esperado por el Sistema
                </p>
                <p className="text-3xl font-bold">
                  S/ {systemMoney.toFixed(2)}
                </p>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="finalMoney">Monto Final Contado (S/)</Label>
              <Input
                id="finalMoney"
                type="number"
                step="0.01"
                value={finalMoney}
                onChange={(e) => setFinalMoney(e.target.value)}
                placeholder="0.00"
                required
                autoFocus
                className="text-2xl font-bold"
              />
            </div>

            {/* Diferencia */}
            {finalMoney && (
              <div
                className={`p-4 rounded-lg ${
                  difference === 0
                    ? " border border-green-200"
                    : difference > 0
                      ? "border border-blue-200"
                      : "border border-red-200"
                }`}
              >
                <p className="text-sm font-medium mb-2">
                  Análisis de Diferencia:
                </p>
                <div className="space-y-1 text-sm mb-3">
                  <div className="flex justify-between">
                    <span>Contaste:</span>
                    <span className="font-mono font-bold">
                      S/ {finalMoneyNum.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sistema esperaba:</span>
                    <span className="font-mono">
                      S/ {systemMoney.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-1 mt-1"></div>
                  <div className="flex justify-between font-bold">
                    <span>Diferencia:</span>
                    <span className="font-mono">
                      {difference >= 0 ? "+" : ""}S/ {difference.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      difference === 0
                        ? "bg-green-500"
                        : difference > 0
                          ? "bg-blue-500"
                          : "bg-red-500"
                    }
                  >
                    {difference === 0
                      ? "✓ EXACTO"
                      : difference > 0
                        ? "↑ SOBRANTE"
                        : "↓ FALTANTE"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {difference === 0
                      ? "Cuadra perfectamente"
                      : difference > 0
                        ? "Hay más dinero del esperado"
                        : "Falta dinero en caja"}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isClosing}>
                {isClosing ? "Cerrando..." : "Cerrar Caja"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
