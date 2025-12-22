// src/components/CashRegister/AddIncomeModal.tsx
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
import { DollarSign } from "lucide-react";
import { cashRegisterApi } from "../services/caja.service";

interface Props {
  open: boolean;
  onClose: () => void;
  cashRegisterId: string;
}

export const AddIncomeModal = ({ open, onClose, cashRegisterId }: Props) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { amount: number; description: string }) =>
      cashRegisterApi.addManualMovement(cashRegisterId, {
        amount: data.amount,
        type: "INGRESO",
        description: data.description,
      }),
    onSuccess: (data) => {
      toast.success("Ingreso registrado exitosamente", {
        description: `Nuevo balance: S/ ${data.currentBalance.toFixed(2)}`,
      });
      queryClient.invalidateQueries({ queryKey: ["cash-register"] });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al registrar ingreso",
      );
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
      toast.error("Debes agregar una descripción");
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
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            Registrar Ingreso Extra
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

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
            <Label htmlFor="description">Descripción*</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length}/200 caracteres
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {mutation.isPending ? "Registrando..." : "Registrar Ingreso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
