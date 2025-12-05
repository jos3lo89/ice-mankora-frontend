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

        <div className="flex items-center justify-between my-4">
          <Button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            -
          </Button>
          <span className="text-lg font-bold">{quantity}</span>
          <Button onClick={() => setQuantity((q) => q + 1)}>+</Button>
        </div>

        {/* Variantes */}
        <div>
          {item.product.variants.map((v) => (
            <label key={v.id} className="flex gap-2 my-1">
              <input
                type="checkbox"
                checked={variants.some((s) => s.id === v.id)}
                onChange={() => toggleVariant(v)}
              />
              {v.name} (+ S/ {Number(v.priceExtra).toFixed(2)})
            </label>
          ))}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded p-2 mt-3"
          placeholder="Agregar nota"
        />

        <DialogFooter className="mt-4">
          <Button variant="destructive" onClick={() => removeItem(item.tempId)}>
            Eliminar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
