import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { ProductsI } from "../types/product.interface";

interface Props {
  product: ProductsI | null;
  open: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, open, onClose }: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);

  if (!product) return null;

  const handleSave = () => {
    addItem(product, quantity, notes, selectedVariants);
    toast.success(`${quantity} x ${product.name} agregado`);
    onClose();
    setQuantity(1);
    setNotes("");
    setSelectedVariants([]);
  };

  const toggleVariant = (variant: any) => {
    if (selectedVariants.find((v) => v.id === variant.id)) {
      setSelectedVariants(selectedVariants.filter((v) => v.id !== variant.id));
    } else {
      setSelectedVariants([...selectedVariants, variant]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            S/ {Number(product.price).toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <Label>Opciones:</Label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center space-x-2 border p-2 rounded"
                  >
                    <Checkbox
                      id={variant.id}
                      checked={selectedVariants.some(
                        (v) => v.id === variant.id
                      )}
                      onCheckedChange={() => toggleVariant(variant)}
                    />
                    <label
                      htmlFor={variant.id}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {variant.name}{" "}
                      {Number(variant.priceExtra) > 0 &&
                        `(+S/${variant.priceExtra})`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 py-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus />
            </Button>
            <span className="text-4xl font-bold w-12 text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() =>
                setQuantity(Math.min(product.stockDaily, quantity + 1))
              }
            >
              <Plus />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Notas de Cocina (Opcional)</Label>
            <Textarea
              placeholder="Ej: Sin hielo, Poco picante..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full text-lg h-12">
            Agregar al Pedido S/
            {(
              (Number(product.price) +
                selectedVariants.reduce(
                  (a, b) => a + Number(b.priceExtra),
                  0
                )) *
              quantity
            ).toFixed(2)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
