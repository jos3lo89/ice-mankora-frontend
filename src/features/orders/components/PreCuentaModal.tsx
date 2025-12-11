import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Order } from "../types/order.types";
import { PDFViewer } from "@react-pdf/renderer";
import { PreCuentaPDF } from "./PreCuentaPDF";

interface PreCuentaModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  onConfirm: () => void;
  isLoading: boolean;
}

export const PreCuentaModal = ({
  open,
  onClose,
  order,
}: PreCuentaModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Pre-Cuenta - {order.table.name}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <PDFViewer
            width="100%" // Ancho completo del contenedor
            height="600px" // Altura fija o dinámica
            showToolbar={true} // Mostrar barra de herramientas
            className="border-0" // Clases CSS personalizadas
          >
            <PreCuentaPDF order={order} />
          </PDFViewer>

          {/* <Button onClick={handleImprimir}>Imprimir Pre-Cuenta</Button> */}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X size={16} />
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
