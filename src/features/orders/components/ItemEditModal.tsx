import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type {
  CartItem,
  ProductVariant,
} from "@/features/orders/types/catalog.types";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MinusIcon, PlusIcon, X } from "lucide-react";

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
    item.selectedVariants,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const toggleVariant = (v: any) => {
    setVariants((prev) =>
      prev.some((s) => s.id === v.id)
        ? prev.filter((s) => s.id !== v.id)
        : [...prev, v],
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

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div
        className="relative z-50 w-full max-w-md gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg animate-in zoom-in-95 fade-in mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Editar producto
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Ajusta los detalles de tu pedido.
          </p>
        </div>

        {/* Cuerpo del Modal */}
        <div className="flex items-center justify-center gap-4 my-4">
          <Button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="cursor-pointer h-8 w-8 rounded-full p-0"
            variant="outline"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="text-xl font-bold w-8 text-center tabular-nums">
            {quantity}
          </span>
          <Button
            onClick={() => setQuantity((q) => q + 1)}
            className="cursor-pointer h-8 w-8 rounded-full p-0"
            variant="outline"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        {item.product.variants && item.product.variants.length > 0 && (
          <div className="space-y-4 py-4 max-h-[30vh] overflow-y-auto custom-scroll pr-1">
            <Label>Opciones:</Label>
            <div className="grid grid-cols-1 gap-2">
              {item.product.variants.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={`modal-${v.id}`}
                    checked={variants.some((s) => s.id === v.id)}
                    onCheckedChange={() => toggleVariant(v)}
                  />
                  <label
                    className="text-sm cursor-pointer flex-1 select-none font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor={`modal-${v.id}`}
                  >
                    {v.name} (+ S/ {Number(v.priceExtra).toFixed(2)})
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 mt-4">
          <Label>Notas de Cocina (Opcional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Sin hielo, Poco picante..."
            className="resize-none min-h-[80px]"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="h-10">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => removeItem(item.tempId)}
            className="h-10"
          >
            Eliminar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 h-10"
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
