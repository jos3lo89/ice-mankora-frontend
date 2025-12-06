import { useState } from "react";
import type {
  CartItem,
  ProductVariant,
} from "@/features/orders/types/catalog.types";
import { useCartStore } from "@/stores/useCartStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ItemEditModalProps {
  item: CartItem;
  open: boolean;
  onClose: () => void;
}

export const ItemEditModal = ({ item, open, onClose }: ItemEditModalProps) => {
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [notes, setNotes] = useState<string>(item.notes ?? "");
  const [variants, setVariants] = useState<ProductVariant[]>(
    item.selectedVariants
  );

  const toggleVariant = (v: ProductVariant) => {
    setVariants((prev) =>
      prev.some((s) => s.id === v.id)
        ? prev.filter((s) => s.id !== v.id)
        : [...prev, v]
    );
  };

  const handleSave = () => {
    updateItem(item.tempId, {
      quantity,
      notes,
      variants,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-4 my-4">
          <Button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="cursor-pointer"
          >
            <MinusIcon />
          </Button>
          <span className="text-lg font-bold">{quantity}</span>
          <Button
            onClick={() => setQuantity((q) => q + 1)}
            className="cursor-pointer"
          >
            <PlusIcon />
          </Button>
        </div>

        {/* Variantes */}
        {item.product.variants && item.product.variants.length > 0 && (
          <div className="space-y-4 py-4">
            <Label>Opciones:</Label>
            <div className="grid grid-cols-2 gap-2">
              {item.product.variants.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center space-x-2 border p-2 rounded"
                >
                  <Checkbox
                    id={v.id}
                    checked={variants.some((s) => s.id === v.id)}
                    onCheckedChange={() => toggleVariant(v)}
                  />

                  <label
                    className="text-sm cursor-pointer flex-1"
                    htmlFor={v.id}
                  >
                    {v.name} (+ S/ {Number(v.priceExtra).toFixed(2)})
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Notas de Cocina (Opcional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Sin hielo, Poco picante..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => removeItem(item.tempId)}>
            Eliminar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
