import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Lock, Loader2 } from "lucide-react";
import { useCancelOrder } from "../hooks/useOrders";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onClose: () => void;
  orderId: string;
  tableNumber: number | null;
}

export const CancelOrderDialog = ({
  open,
  onClose,
  orderId,
  tableNumber,
}: Props) => {
  const [reason, setReason] = useState("");
  const [authCode, setAuthCode] = useState("");

  const { mutate: cancel, isPending } = useCancelOrder();

  const handleCancel = () => {
    if (!reason.trim()) {
      toast.error("Debes ingresar el motivo de la anulación.");
      return;
    }
    if (!authCode.trim()) {
      toast.error("Ingresa el PIN de autorización.");
      return;
    }

    cancel(
      { orderId, reason, authCode },
      {
        onSuccess: () => {
          onClose();
          setReason("");
          setAuthCode("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>Anular Orden</DialogTitle>
          </div>
          <DialogDescription>
            Esta acción liberará la <strong>Mesa {tableNumber}</strong> sin
            cobrar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="reason">
              Motivo <Badge variant="destructive">Obligatorio</Badge>
            </Label>
            <Textarea
              id="reason"
              placeholder="Ej: Cliente se escapó"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="focus-visible:ring-red-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-2">
              <Lock size={14} /> PIN de Autorización
            </Label>
            <Input
              id="code"
              type="password"
              placeholder="****"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="font-mono tracking-widest"
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending || !reason || !authCode}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Anulación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
