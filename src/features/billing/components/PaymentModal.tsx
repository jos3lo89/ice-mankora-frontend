import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComprobanteType, PaymentMethod } from "../types/billing.types";
import { Loader2, Printer, CheckCircle2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Ticket } from "./Ticket";
import { toast } from "sonner";
import { useCreateSale, usePrintData } from "../hooks/seBilling";

interface Props {
  open: boolean;
  onClose: () => void;
  orderId: string;
  totalAmount: number; // Para mostrarlo en el modal
}

export const PaymentModal = ({
  open,
  onClose,
  orderId,
  totalAmount,
}: Props) => {
  const [step, setStep] = useState<"PAYMENT" | "PRINT">("PAYMENT");
  const [saleId, setSaleId] = useState<string | null>(null);

  // Form State
  const [docType, setDocType] = useState<ComprobanteType>(
    ComprobanteType.BOLETA
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.EFECTIVO
  );
  const [clientDoc, setClientDoc] = useState("");
  const [clientName, setClientName] = useState("");

  // Hooks
  const createSaleMutation = useCreateSale((id) => {
    setSaleId(id);
    setStep("PRINT");
  });

  const { data: printData, isLoading: isLoadingPrint } = usePrintData(saleId);
  const ticketRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: ticketRef }); // Hook corregido para v17+

  const handlePay = () => {
    // Validaciones básicas de Frontend
    if (docType === ComprobanteType.FACTURA) {
      if (clientDoc.length !== 11) {
        toast.error("Para factura, el RUC debe tener 11 dígitos");
        return;
      }
      if (!clientName) {
        toast.error("Falta la Razón Social");
        return;
      }
    }

    createSaleMutation.mutate({
      orderId,
      type: docType,
      paymentMethod,
      clientDocNumber: clientDoc,
      clientDocType: docType === ComprobanteType.FACTURA ? "6" : "1", // 6=RUC, 1=DNI
      clientName:
        clientName ||
        (docType === ComprobanteType.BOLETA ? "CLIENTE VARIOS" : ""),
    });
  };

  const handleCloseComplete = () => {
    setStep("PAYMENT");
    setSaleId(null);
    setClientDoc("");
    setClientName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {/* COMPONENTE INVISIBLE PARA IMPRIMIR */}
        <div style={{ display: "none" }}>
          <Ticket ref={ticketRef} data={printData || null} />
        </div>

        {step === "PAYMENT" ? (
          <>
            <DialogHeader>
              <DialogTitle>Cobrar Pedido</DialogTitle>
              <p className="text-2xl font-bold text-primary mt-2">
                Total: S/ {totalAmount.toFixed(2)}
              </p>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* 1. TIPO DE COMPROBANTE */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={
                    docType === ComprobanteType.BOLETA ? "default" : "outline"
                  }
                  onClick={() => {
                    setDocType(ComprobanteType.BOLETA);
                    setClientName(""); // Limpiar para boleta genérica
                    setClientDoc("");
                  }}
                >
                  BOLETA
                </Button>
                <Button
                  variant={
                    docType === ComprobanteType.FACTURA ? "default" : "outline"
                  }
                  onClick={() => setDocType(ComprobanteType.FACTURA)}
                >
                  FACTURA
                </Button>
              </div>

              {/* 2. DATOS DEL CLIENTE */}
              <div className="space-y-2">
                <Label>
                  Cliente{" "}
                  {docType === ComprobanteType.FACTURA
                    ? "(RUC Obligatorio)"
                    : "(Opcional)"}
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder={
                      docType === ComprobanteType.FACTURA
                        ? "RUC (11 dígitos)"
                        : "DNI (Opcional)"
                    }
                    value={clientDoc}
                    onChange={(e) => setClientDoc(e.target.value)}
                    maxLength={docType === ComprobanteType.FACTURA ? 11 : 8}
                  />
                  {/* Botón Simulado de Búsqueda RENIEC/SUNAT */}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      // Mock de búsqueda
                      if (clientDoc === "20600000001")
                        setClientName("EMPRESA DEMO S.A.C.");
                      else if (clientDoc.length === 8)
                        setClientName("JUAN PEREZ");
                      else
                        toast.info(
                          "No encontrado en padrón local (Simulación)"
                        );
                    }}
                  >
                    🔍
                  </Button>
                </div>
                <Input
                  placeholder="Nombre o Razón Social"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              {/* 3. MÉTODO DE PAGO */}
              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentMethod.EFECTIVO}>
                      💵 Efectivo
                    </SelectItem>
                    <SelectItem value={PaymentMethod.TARJETA}>
                      💳 Tarjeta
                    </SelectItem>
                    <SelectItem value={PaymentMethod.YAPE}>
                      📱 Yape / Plin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handlePay}
                disabled={createSaleMutation.isPending}
              >
                {createSaleMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cobrar S/ {totalAmount.toFixed(2)}
              </Button>
            </DialogFooter>
          </>
        ) : (
          /* PASO 2: IMPRESIÓN */
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 /> ¡Venta Exitosa!
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center justify-center gap-4">
              <p className="text-center text-muted-foreground">
                El comprobante se ha generado correctamente. <br />
                ¿Deseas imprimir el ticket ahora?
              </p>
              {isLoadingPrint ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => handlePrint()}
                >
                  <Printer className="mr-2" /> Imprimir Ticket
                </Button>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleCloseComplete}
              >
                Cerrar y Liberar Mesa
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
