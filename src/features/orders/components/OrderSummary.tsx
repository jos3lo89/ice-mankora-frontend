import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ShoppingBasket,
  Trash2,
  Send,
  Pencil,
  X,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useCreateOrder } from "../hooks/useCatalog";
import type { CartItem, ProductVariant } from "../types/catalog.types";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// --- SUB-COMPONENTE: Editor en Línea ---
// Este componente se encarga de la lógica de edición de un solo item
const InlineCartEditor = ({
  item,
  onCancel,
  onSave,
}: {
  item: CartItem;
  onCancel: () => void;
  onSave: () => void; // Callback para cerrar el editor tras guardar
}) => {
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);

  // Estados locales para la edición
  const [quantity, setQuantity] = useState(item.quantity);
  const [notes, setNotes] = useState(item.notes || "");
  const [variants, setVariants] = useState<ProductVariant[]>(
    item.selectedVariants || []
  );

  const toggleVariant = (v: ProductVariant) => {
    setVariants((prev) =>
      prev.some((s) => s.id === v.id)
        ? prev.filter((s) => s.id !== v.id)
        : [...prev, v]
    );
  };

  const handleSaveInternal = () => {
    updateItem(item.tempId, { quantity, notes, variants });
    onSave();
  };

  return (
    <div className="border-2 border-gray-600 rounded-xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Cabecera del Editor */}
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

      {/* Control de Cantidad */}
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

      {/* Variantes */}
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

      {/* Notas */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase">Nota</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Sin cebolla, extra salsa..."
          className="min-h-[60px] text-sm"
        />
      </div>

      {/* Botones de Acción */}
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

// --- COMPONENTE PRINCIPAL ---
export const OrderSummary = () => {
  const { items, total, itemCount, removeItem, tableId } = useCartStore();
  const { mutate: sendOrder, isPending } = useCreateOrder();

  // Estado para controlar qué item se está editando (por ID temporal)
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleSend = () => {
    if (!tableId) return;
    const payload = {
      tableId,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        notes: item.notes,
        variantsDetail: item.variantsDetailString,
      })),
    };
    sendOrder(payload);
  };

  if (itemCount() === 0) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-4 right-4 h-16 w-16 cursor-pointer rounded-full shadow-2xl z-50">
          <div className="relative">
            <ShoppingBasket size={28} />
            <span className="absolute -top-5 -right-5 bg-red-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-white">
              {itemCount()}
            </span>
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
        <div className="border-b">
          <SheetHeader>
            <SheetTitle>Pedidos</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4 custom-scroll pb-20">
          {items.map((item) => {
            // VERIFICAMOS SI ESTE ITEM ES EL QUE SE ESTÁ EDITANDO
            const isEditing = editingItemId === item.tempId;

            if (isEditing) {
              // MODO EDICIÓN: Renderizamos el formulario en lugar de la tarjeta normal
              return (
                <InlineCartEditor
                  key={item.tempId}
                  item={item}
                  onCancel={() => setEditingItemId(null)}
                  onSave={() => setEditingItemId(null)}
                />
              );
            }

            // MODO VISTA: Renderizamos la tarjeta normal
            return (
              <div
                key={item.tempId}
                className="shadow-sm border rounded-xl p-4 flex justify-between items-start "
              >
                {/* INFO DEL PRODUCTO */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setEditingItemId(item.tempId)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600 px-2 py-0.5 rounded text-sm">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold">{item.product.name}</span>
                  </div>

                  {item.variantsDetailString && (
                    <p className="text-xs  mt-1 ml-1 pl-2 border-l-2 border-gray-200">
                      {item.variantsDetailString}
                    </p>
                  )}

                  {item.notes && (
                    <p className="text-xs text-orange-600 italic mt-1 ml-1">
                      Nota: {item.notes}
                    </p>
                  )}

                  <p className="mt-2 font-bold">
                    S/ {item.subtotal.toFixed(2)}
                  </p>
                </div>

                {/* ACCIONES RÁPIDAS */}
                <div className="flex flex-col gap-2 pl-2 border-l ml-2">
                  <button
                    onClick={() => setEditingItemId(item.tempId)}
                    className="h-8 w-8 flex items-center justify-center rounded-full  text-blue-600 hover:bg-blue-200 cursor-pointer transition-colors"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => removeItem(item.tempId)}
                    className="h-8 w-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-200 cursor-pointer transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <SheetFooter>
          <div className="w-full p-6 border-t space-y-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>S/ {total().toFixed(2)}</span>
            </div>

            <Button
              className="w-full text-lg cursor-pointer rounded-xl bg-green-600 hover:bg-green-700 h-12"
              onClick={handleSend}
              disabled={isPending}
            >
              {isPending ? (
                "Enviando..."
              ) : (
                <span className="flex items-center gap-2">
                  Confirmar Pedido <Send size={20} />
                </span>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
