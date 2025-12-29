import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Loader2, CheckCircle2 } from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
import { toast } from "sonner";
import { BoletaPDF } from "./documents/BoletaPDF";
import { FacturaPDF } from "./documents/FacturaPDF";
import { TicketConsumoPDF } from "./documents/TicketConsumoPDF";
import { useNavigate } from "react-router-dom";
import { useCreateSale, usePrintData } from "../hooks/seBilling";

interface Props {
  open: boolean;
  onClose: () => void;
  orderId: string;
  totalAmount: number;
  itemIds?: string[];
  allItemsPaid?: boolean;
}

export const PaymentModal = ({
  open,
  onClose,
  orderId,
  totalAmount,
  itemIds,
  allItemsPaid = false,
}: Props) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"PAYMENT" | "PRINT">("PAYMENT");
  const [saleId, setSaleId] = useState<string | null>(null);
  const [finalAllItemsPaid, setFinalAllItemsPaid] = useState(allItemsPaid);

  const isPartialPayment = itemIds && itemIds.length > 0;

  const [docType, setDocType] = useState<ComprobanteType>(
    ComprobanteType.TICKET,
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.EFECTIVO,
  );

  const [clientDoc, setClientDoc] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  const [montoPagado, setMontoPagado] = useState<string>("");
  const [vuelto, setVuelto] = useState<number>(0);
  // const [searchingDoc, setSearchingDoc] = useState(false);

  const createSaleMutation = useCreateSale((id, orderStatus) => {
    setSaleId(id);
    setStep("PRINT");
    if (orderStatus) {
      setFinalAllItemsPaid(orderStatus.allItemsPaid);
    }
  });

  const { data: printData, isLoading: isLoadingPrint } = usePrintData(saleId);

  useEffect(() => {
    const pago = parseFloat(montoPagado) || 0;
    const cambio = pago - totalAmount;
    setVuelto(cambio > 0 ? cambio : 0);
  }, [montoPagado, totalAmount]);

  useEffect(() => {
    if (docType === ComprobanteType.TICKET) {
      setClientDoc("");
      setClientName("");
      setClientAddress("");
    }
  }, [docType]);

  const handlePay = () => {
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

    if (docType === ComprobanteType.BOLETA && clientDoc) {
      if (clientDoc.length !== 8) {
        toast.error("El DNI debe tener 8 dígitos");
        return;
      }
    }

    if (paymentMethod === PaymentMethod.EFECTIVO) {
      const pago = parseFloat(montoPagado) || 0;
      if (pago < totalAmount) {
        toast.error("El monto pagado es insuficiente");
        return;
      }
    }

    const payload = {
      orderId,
      type: docType,
      paymentMethod,
      itemIds,
      ...(docType !== ComprobanteType.TICKET && {
        clientDocNumber: clientDoc,
        clientDocType: docType === ComprobanteType.FACTURA ? "6" : "1",
        clientName: clientName || "CLIENTE VARIOS",
        clientAddress,
      }),
      ...(paymentMethod === PaymentMethod.EFECTIVO && {
        montoPagado: parseFloat(montoPagado),
        vuelto,
      }),
    };

    createSaleMutation.mutate(payload);
  };

  const handleCloseComplete = () => {
    setStep("PAYMENT");
    setSaleId(null);
    setClientDoc("");
    setClientName("");
    setClientAddress("");
    setMontoPagado("");
    setVuelto(0);

    if (!isPartialPayment || finalAllItemsPaid) {
      onClose();
      navigate("/caja/mesas", { replace: true });
    } else {
      onClose();
    }
  };

  const renderPDF = () => {
    if (!printData) {
      return <TicketConsumoPDF data={null as any} />;
    }

    switch (printData.document.type) {
      case ComprobanteType.BOLETA:
        return <BoletaPDF data={printData} />;
      case ComprobanteType.FACTURA:
        return <FacturaPDF data={printData} />;
      case ComprobanteType.TICKET:
        return <TicketConsumoPDF data={printData} />;
      default:
        return <TicketConsumoPDF data={printData} />;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {step === "PAYMENT" ? (
            <>
              <DialogHeader>
                <DialogTitle>Cobrar Pedido</DialogTitle>
                {isPartialPayment && (
                  <p className="text-sm text-amber-600 font-medium">
                    ⚠️ Pago parcial - La mesa seguirá ocupada
                  </p>
                )}
                <DialogDescription></DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* TOTAL A PAGAR */}
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total a Pagar
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    S/ {totalAmount.toFixed(2)}
                  </p>
                </div>

                {/* 1. TIPO DE COMPROBANTE */}
                <div className="space-y-2">
                  <Label>Tipo de Comprobante</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={
                        docType === ComprobanteType.TICKET
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setDocType(ComprobanteType.TICKET)}
                      className="h-auto py-3 flex flex-col gap-1"
                    >
                      <span className="text-lg">🧾</span>
                      <span className="text-xs">Ticket</span>
                    </Button>
                    {/* <Button
                      type="button"
                      variant={
                        docType === ComprobanteType.BOLETA
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setDocType(ComprobanteType.BOLETA)}
                      className="h-auto py-3 flex flex-col gap-1"
                    >
                      <span className="text-lg">📄</span>
                      <span className="text-xs">Boleta</span>
                    </Button> */}
                    {/* <Button
                      type="button"
                      variant={
                        docType === ComprobanteType.FACTURA
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setDocType(ComprobanteType.FACTURA)}
                      className="h-auto py-3 flex flex-col gap-1"
                    >
                      <span className="text-lg">📋</span>
                      <span className="text-xs">Factura</span>
                    </Button> */}
                  </div>
                </div>

                {/* 2. DATOS DEL CLIENTE (Solo si no es Ticket) */}
                {/* {docType !== ComprobanteType.TICKET && (
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                    <Label className="text-base font-semibold">
                      Datos del Cliente
                      {docType === ComprobanteType.FACTURA && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>

                    <div className="space-y-2">
                      <Label>
                        {docType === ComprobanteType.FACTURA ? "RUC" : "DNI"}
                        {docType === ComprobanteType.FACTURA &&
                          " (Obligatorio)"}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder={
                            docType === ComprobanteType.FACTURA
                              ? "RUC (11 dígitos)"
                              : "DNI (8 dígitos)"
                          }
                          value={clientDoc}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setClientDoc(value);
                          }}
                          maxLength={
                            docType === ComprobanteType.FACTURA ? 11 : 8
                          }
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleSearchDocument}
                          disabled={searchingDoc}
                          className="shrink-0"
                        >
                          {searchingDoc ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        {docType === ComprobanteType.FACTURA
                          ? "Razón Social"
                          : "Nombre Completo"}
                      </Label>
                      <Input
                        placeholder={
                          docType === ComprobanteType.FACTURA
                            ? "EMPRESA S.A.C."
                            : "Juan Pérez"
                        }
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>

                    {docType === ComprobanteType.FACTURA && (
                      <div className="space-y-2">
                        <Label>Dirección (Opcional)</Label>
                        <Input
                          placeholder="Av. Principal 123"
                          value={clientAddress}
                          onChange={(e) => setClientAddress(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )} */}

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
                        💳 Tarjeta (POS)
                      </SelectItem>
                      <SelectItem value={PaymentMethod.YAPE}>
                        📱 Yape
                      </SelectItem>
                      <SelectItem value={PaymentMethod.PLIN}>
                        📱 Plin
                      </SelectItem>
                      <SelectItem value={PaymentMethod.TRANSFERENCIA}>
                        🏦 Transferencia
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. CÁLCULO DE VUELTO (Solo si es Efectivo) */}
                {paymentMethod === PaymentMethod.EFECTIVO && (
                  <div className="space-y-3 p-4 border rounded-lg ">
                    <Label className="text-base font-semibold">
                      Cálculo de Vuelto
                    </Label>

                    <div className="space-y-2">
                      <Label>Con cuánto paga el cliente?</Label>
                      <Input
                        type="number"
                        placeholder="100.00"
                        value={montoPagado}
                        onChange={(e) => setMontoPagado(e.target.value)}
                        step="0.01"
                        className="text-lg font-semibold"
                      />
                    </div>

                    {montoPagado && (
                      <div className="pt-3 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-medium">
                            S/ {totalAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Paga con:
                          </span>
                          <span className="font-medium">
                            S/ {parseFloat(montoPagado).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-green-700 pt-2 border-t">
                          <span>Vuelto:</span>
                          <span>S/ {vuelto.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  onClick={handlePay}
                  disabled={createSaleMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {createSaleMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cobrar S/ {totalAmount.toFixed(2)}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 /> ¡Venta Exitosa!
                </DialogTitle>
                {finalAllItemsPaid && (
                  <p className="text-sm text-green-600 font-medium">
                    ✅ Todos los items han sido pagados. Mesa liberada.
                  </p>
                )}
              </DialogHeader>

              <div className="space-y-4">
                {isLoadingPrint ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : printData ? (
                  <div className="border-2 rounded-lg overflow-hidden">
                    <PDFViewer width="100%" height="500px" showToolbar={true}>
                      {renderPDF()}
                    </PDFViewer>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      No hay datos para mostrar
                    </p>
                  </div>
                )}

                {printData?.payment?.method === PaymentMethod.EFECTIVO &&
                  printData.payment.vuelto &&
                  printData.payment.vuelto > 0 && (
                    <div className=" border border-green-200 rounded-lg p-4">
                      <p className="text-center text-green-500 font-semibold">
                        💵 Vuelto: S/ {printData.payment.vuelto.toFixed(2)}
                      </p>
                    </div>
                  )}
              </div>

              <DialogFooter className="flex-col gap-2 ">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleCloseComplete}
                >
                  {/* ✅ TEXTO DINÁMICO BASADO EN EL BACKEND */}
                  {!isPartialPayment || finalAllItemsPaid
                    ? "Cerrar y Volver al Mapa"
                    : "Continuar con Otros Pagos"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
