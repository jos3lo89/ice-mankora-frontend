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
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
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
  onConfirm,
}: PreCuentaModalProps) => {
  // const [showPreview, setShowPreview] = useState(false);

  // const handlePrint = () => {
  //   onConfirm();
  // };

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
          {/* Botones de acción superiores */}
          {/* <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              <Eye size={16} />
              {showPreview ? "Ocultar" : "Previsualizar"} Ticket
            </Button>
          </div> */}
          {/* <PDFViewer width="100%" height="600px">
            <PreCuentaPDF order={order} />
          </PDFViewer> */}
          <PDFViewer
            width="100%" // Ancho completo del contenedor
            height="600px" // Altura fija o dinámica
            showToolbar={true} // Mostrar barra de herramientas
            className="border-0" // Clases CSS personalizadas
          >
            <PreCuentaPDF order={order} />
          </PDFViewer>
          {/* <PDFDownloadLink
            document={<PreCuentaPDF order={order} />}
            fileName={`precuenta-${order.dailyNumber}.pdf`}
          >
            <Button>Descargar PDF</Button>
          </PDFDownloadLink> */}
          <PDFDownloadLink
            document={<PreCuentaPDF order={order} />}
            fileName={`precuenta-${order.dailyNumber}-mesa-${order.table.number}.pdf`}
          >
            {({ loading }) => (loading ? "Preparando PDF..." : "Descargar PDF")}
          </PDFDownloadLink>
          <Button onClick={onConfirm}>Imprimir Pre-Cuenta</Button>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X size={16} />
            Cancelar
          </Button>
          {/* <Button
            onClick={handlePrint}
            disabled={isLoading}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Imprimiendo...
              </>
            ) : (
              <>
                <Printer size={16} />
                Imprimir Pre-Cuenta
              </>
            )}
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
