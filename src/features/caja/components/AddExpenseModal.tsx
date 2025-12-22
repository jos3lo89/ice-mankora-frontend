// src/components/CashRegister/AddExpenseModal.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { TrendingDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cashRegisterApi } from "../services/caja.service";

interface Props {
  open: boolean;
  onClose: () => void;
  cashRegisterId: string;
}

export const AddExpenseModal = ({ open, onClose, cashRegisterId }: Props) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { amount: number; description: string }) =>
      cashRegisterApi.addManualMovement(cashRegisterId, {
        amount: data.amount,
        type: "EGRESO",
        description: data.description,
      }),
    onSuccess: (data) => {
      toast.success("Gasto registrado exitosamente", {
        description: `Nuevo balance: S/ ${data.currentBalance.toFixed(2)}`,
      });
      queryClient.invalidateQueries({ queryKey: ["cash-register"] });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al registrar gasto");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }

    if (!description.trim()) {
      toast.error("Debes agregar una descripción del gasto");
      return;
    }

    mutation.mutate({
      amount: amountNum,
      description: description.trim(),
    });
  };

  const handleClose = () => {
    setAmount("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-full">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            Registrar Egreso (Gasto)
          </DialogTitle>
          <DialogDescription>
            Registra gastos como compra de insumos, etc.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Este monto se descontará del balance de caja actual
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto (S/)*</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Gasto*</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length}/200 caracteres - Describe el motivo del gasto
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              variant="destructive"
            >
              {mutation.isPending ? "Registrando..." : "Registrar Gasto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
