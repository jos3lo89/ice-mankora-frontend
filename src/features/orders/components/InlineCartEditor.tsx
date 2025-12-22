import { useCartStore } from "@/stores/useCartStore";
import type { CartItem, ProductVariant } from "../types/catalog.types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export const InlineCartEditor = ({
  item,
  onCancel,
  onSave,
}: {
  item: CartItem;
  onCancel: () => void;
  onSave: () => void;
}) => {
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const [quantity, setQuantity] = useState(item.quantity);
  const [notes, setNotes] = useState(item.notes || "");
  const [variants, setVariants] = useState<ProductVariant[]>(
    item.selectedVariants || [],
  );

  const toggleVariant = (v: any) => {
    setVariants((prev) =>
      prev.some((s) => s.id === v.id)
        ? prev.filter((s) => s.id !== v.id)
        : [...prev, v],
    );
  };

  const handleSaveInternal = () => {
    updateItem(item.tempId, { quantity, notes, variants });
    onSave();
  };

  return (
    <div className="border-2 border-gray-600 rounded-xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center border-b pb-2">
        <span className="font-bold text-blue-700">
          Editando: {item.product.name}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0 text-gray-500"
        >
          <X size={18} />
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4  p-2 rounded-lg border">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="h-8 w-8"
        >
          <Minus size={14} />
        </Button>
        <span className="font-bold text-lg w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity((q) => q + 1)}
          className="h-8 w-8"
        >
          <Plus size={14} />
        </Button>
      </div>

      {item.product.variants && item.product.variants.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase">Extras</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scroll pr-1">
            {item.product.variants.map((v) => (
              <div
                key={v.id}
                className="flex items-center space-x-2 p-2 rounded border"
              >
                <Checkbox
                  id={`inline-${v.id}`}
                  checked={variants.some((s) => s.id === v.id)}
                  onCheckedChange={() => toggleVariant(v)}
                />
                <label
                  htmlFor={`inline-${v.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                >
                  {v.name} (+S/{Number(v.priceExtra).toFixed(2)})
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase">Nota</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Sin cebolla, extra salsa..."
          className="min-h-[60px] text-sm"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="destructive"
          className="flex-1 h-9"
          onClick={() => removeItem(item.tempId)}
        >
          <Trash2 size={16} className="mr-2" /> Borrar
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 h-9"
          onClick={handleSaveInternal}
        >
          <Check size={16} className="mr-2" /> Guardar
        </Button>
      </div>
    </div>
  );
};
