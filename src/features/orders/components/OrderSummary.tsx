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
import { ShoppingBasket, Trash2, Send, Pencil } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateOrder } from "../hooks/useCatalog";
import { useState } from "react";
import type { CartItem } from "../types/catalog.types";
import { ItemEditModal } from "./ItemEditModal";

export const OrderSummary = () => {
  const { items, total, itemCount, removeItem, tableId } = useCartStore();
  const { mutate: sendOrder, isPending } = useCreateOrder();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

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

  if (itemCount() === 0) return null; // No mostrar si está vacío

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-xl z-50 animate-in zoom-in cursor-pointer">
            <div className="relative">
              <ShoppingBasket size={28} />
              <span className="absolute -top-5 -right-5 bg-red-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-white">
                {itemCount()}
              </span>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Pedido Mesa {tableId && "Seleccionada"}</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 -mx-6 px-6 my-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.tempId}
                  className="flex justify-between items-start border-b pb-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        {item.quantity}x
                      </span>
                      <span className="font-medium">{item.product.name}</span>
                    </div>
                    {item.variantsDetailString && (
                      <p className="text-xs text-muted-foreground ml-6">
                        +{item.variantsDetailString}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-orange-600 italic ml-6">
                        Nota: {item.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => removeItem(item.tempId)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>

                    <span className="font-semibold">
                      S/ {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <SheetFooter className="mt-auto border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>S/ {total().toFixed(2)}</span>
              </div>
              <Button
                className="w-full h-12 text-lg"
                onClick={handleSend}
                disabled={isPending}
              >
                {isPending ? (
                  "Enviando..."
                ) : (
                  <span className="flex items-center gap-2">
                    Confirmar Pedido <Send size={18} />
                  </span>
                )}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* MODAL DE EDICIÓN */}
      {editingItem && (
        <ItemEditModal
          item={editingItem}
          open={true}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
};
