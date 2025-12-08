import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { PrintLog } from "../types/order.types";

interface ComandaPreviewModalProps {
  open: boolean;
  onClose: () => void;
  printLog: PrintLog;
  onReprint: () => void;
}

export const ComandaPreviewModal = ({
  open,
  onClose,
  printLog,
  onReprint,
}: ComandaPreviewModalProps) => {
  const sentData = printLog.sentData as any;

  if (!sentData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Previsualización de Comanda</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* Simulación del ticket térmico */}
        <div className=" border-2 border-dashed border-gray-300 rounded-lg p-6 font-mono text-sm">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-3 mb-3">
            <div className="text-xl font-bold">ICE MANKORA</div>
            <div className="text-lg font-semibold mt-1">
              {sentData.floorName || printLog.floor.name}
            </div>
          </div>

          {/* Info de la orden */}
          <div className="space-y-1 mb-3 text-xs">
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-bold">ORDEN #{sentData.dailyNumber}</span>
              <span className="font-bold">MESA {sentData.tableNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Mozo:</span>{" "}
              <span className="font-semibold">{sentData.waiter || "N/A"}</span>
            </div>
            <div>
              <span className="text-gray-600">Fecha:</span>{" "}
              {format(new Date(printLog.createdAt), "dd/MM/yyyy HH:mm:ss", {
                locale: es,
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-800 my-3"></div>

          {/* Items */}
          <div className="mb-3">
            <div className="font-bold mb-2 flex justify-between text-xs">
              <span>CANT</span>
              <span>PRODUCTO</span>
            </div>
            <div className="border-t border-gray-400 pt-2 space-y-3">
              {sentData.items?.map((item: any, index: number) => (
                <div key={index} className="text-xs">
                  <div className="flex gap-3">
                    <span className="font-bold text-green-700 min-w-[30px]">
                      {item.quantity}x
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      {item.categoryName && (
                        <div className="text-[10px] text-gray-500 italic mt-0.5">
                          {item.categoryName}
                        </div>
                      )}
                      {item.variantsDetail && (
                        <div className="text-[10px] text-blue-600 mt-1 pl-2 border-l-2 border-blue-300">
                          {item.variantsDetail}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-[10px] text-orange-600 italic mt-1 pl-2 border-l-2 border-orange-300">
                          ⚠️ {item.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-800 pt-3 mt-3">
            <div className="text-center font-bold text-base">
              TOTAL: {sentData.items?.length || 0} ITEMS
            </div>
          </div>

          {/* Info adicional */}
          <div className="mt-3 pt-3 border-t border-gray-300 text-center text-[10px] text-gray-500">
            {printLog.status === "PRINTED" && <div>✓ Impreso exitosamente</div>}
            {printLog.attemptCount > 1 && (
              <div>Intentos de impresión: {printLog.attemptCount}</div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <DialogFooter className="flex gap-2 ">
          <Button size={"sm"} variant="outline" onClick={onClose}>
            <X />
            Cerrar
          </Button>
          <Button
            onClick={onReprint}
            size={"sm"}
            className="bg-green-600 hover:bg-green-700"
          >
            <Printer />
            Reimprimir Ahora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
