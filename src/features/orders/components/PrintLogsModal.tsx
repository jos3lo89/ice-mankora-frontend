import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Printer,
  AlertCircle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ComandaPreviewModal } from "./ComandaPreviewModal";
import { useOrderPrintLogs, useRetryPrint } from "../hooks/useCatalog";
import type { PrintLog } from "../types/order.types";

interface PrintLogsModalProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

export const PrintLogsModal = ({
  orderId,
  open,
  onClose,
}: PrintLogsModalProps) => {
  const { data: printLogs, isLoading } = useOrderPrintLogs(orderId);
  const { mutate: retry, isPending } = useRetryPrint();
  const [previewLog, setPreviewLog] = useState<PrintLog | null>(null);

  const getStatusBadge = (
    status: "PENDING" | "PRINTED" | "FAILED" | "RETRYING"
  ) => {
    const variants = {
      PENDING: {
        variant: "secondary",
        icon: Printer,
        label: "Pendiente",
        color: "text-yellow-600",
      },
      PRINTED: {
        variant: "success",
        icon: CheckCircle2,
        label: "Impreso",
        color: "text-green-600",
      },
      FAILED: {
        variant: "destructive",
        icon: AlertCircle,
        label: "Error",
        color: "text-red-600",
      },
      RETRYING: {
        variant: "warning",
        icon: RefreshCw,
        label: "Reintentando",
        color: "text-orange-600",
      },
    };

    const config = variants[status] || variants.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="gap-1">
        <Icon size={14} />
        {config.label}
      </Badge>
    );
  };

  const handleReprint = (printLogId: string) => {
    retry(printLogId);
  };

  const handlePreview = (log: PrintLog) => {
    setPreviewLog(log);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto custom-scroll">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Historial de Impresiones
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
          ) : printLogs && printLogs.length > 0 ? (
            <div className="space-y-4">
              {printLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 space-y-3 hover:bg-muted/50 transition-colors"
                >
                  {/* Header con piso y estado */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start gap-3">
                      <Badge variant="outline" className="text-sm font-medium">
                        📍 {log.floor.name} (Piso {log.floor.level})
                      </Badge>
                      {getStatusBadge(log.status)}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Botón de Previsualizar - Siempre visible si hay datos */}
                      {log.sentData && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(log)}
                          className="gap-2"
                        >
                          <Eye size={16} />
                          Previsualizar
                        </Button>
                      )}

                      {/* Botón de Reintentar - Solo para errores */}
                      {log.status === "FAILED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReprint(log.id)}
                          disabled={isPending}
                          className="gap-2 text-orange-600 hover:text-orange-700"
                        >
                          <RefreshCw
                            size={16}
                            className={isPending ? "animate-spin" : ""}
                          />
                          Reintentar
                        </Button>
                      )}

                      {/* Botón de Reimprimir - Para impresiones exitosas */}
                      {log.status === "PRINTED" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleReprint(log.id)}
                          disabled={isPending}
                          className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <Printer
                            size={16}
                            className={isPending ? "animate-pulse" : ""}
                          />
                          Reimprimir
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Información del log */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground font-medium">
                        Intentos:
                      </span>
                      <span className="ml-2 font-semibold">
                        {log.attemptCount}
                      </span>
                    </div>

                    {log.lastAttempt && (
                      <div>
                        <span className="text-muted-foreground font-medium">
                          Último intento:
                        </span>
                        <span className="ml-2">
                          {format(
                            new Date(log.lastAttempt),
                            "dd/MM/yyyy HH:mm:ss",
                            { locale: es }
                          )}
                        </span>
                      </div>
                    )}

                    {log.printerIp && (
                      <div>
                        <span className="text-muted-foreground font-medium">
                          IP Impresora:
                        </span>
                        <span className="ml-2 font-mono text-xs bg-muted px-2 py-0.5 rounded">
                          {log.printerIp}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-muted-foreground font-medium">
                        Fecha creación:
                      </span>
                      <span className="ml-2">
                        {format(
                          new Date(log.createdAt),
                          "dd/MM/yyyy HH:mm:ss",
                          { locale: es }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Mensaje de error si existe */}
                  {log.errorMessage && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <p className="text-destructive text-sm font-medium flex items-center gap-2">
                        <AlertCircle size={16} />
                        Error: {log.errorMessage}
                      </p>
                    </div>
                  )}

                  {/* Detalles técnicos (colapsable) */}
                  {log.sentData && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground font-medium">
                        📋 Ver datos técnicos enviados
                      </summary>
                      <pre className="mt-2 p-3 bg-muted rounded overflow-x-auto text-[11px] leading-relaxed">
                        {JSON.stringify(log.sentData, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Printer
                className="mx-auto mb-4 text-muted-foreground"
                size={48}
              />
              <p className="text-muted-foreground">
                No hay registros de impresión para esta orden.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Previsualización */}
      {previewLog && (
        <ComandaPreviewModal
          open={!!previewLog}
          onClose={() => setPreviewLog(null)}
          printLog={previewLog}
          onReprint={() => {
            handleReprint(previewLog.id);
            setPreviewLog(null);
          }}
        />
      )}
    </>
  );
};
