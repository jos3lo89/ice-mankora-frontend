// src/components/CashRegister/OpenCashRegisterModal.tsx
import { useState } from "react";
import { useCashRegister } from "../hooks/useCashRegister";
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

interface Props {
  open: boolean;
  onClose: () => void;
}

export const OpenCashRegisterModal = ({ open, onClose }: Props) => {
  const [initialMoney, setInitialMoney] = useState("");
  const { openCashRegister, isOpening } = useCashRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(initialMoney);

    if (isNaN(amount) || amount < 0) {
      return;
    }

    openCashRegister(amount, {
      onSuccess: () => {
        onClose();
        setInitialMoney("");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abrir Caja</DialogTitle>
          <DialogDescription>
            Ingresa el monto inicial con el que comenzarás el día
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initialMoney">Monto Inicial (S/)</Label>
            <Input
              id="initialMoney"
              type="number"
              step="0.01"
              min="0"
              value={initialMoney}
              onChange={(e) => setInitialMoney(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isOpening}>
              {isOpening ? "Abriendo..." : "Abrir Caja"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
