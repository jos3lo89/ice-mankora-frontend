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
import { useCreateOrder } from "../hooks/useCatalog";
import { useState } from "react";
import type { CartItem } from "../types/catalog.types";
import { ItemEditModal } from "./ItemEditModal";

export const OrderSummary = () => {
  const { items, total, itemCount, removeItem, tableId } = useCartStore();
  const { mutate: sendOrder, isPending } = useCreateOrder();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    <>
      {/* BOTÓN FLOTANTE DEL CARRITO */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 h-16 w-16 cursor-pointer rounded-full shadow-2xl  z-50">
            <div className="relative">
              <ShoppingBasket size={28} />
              <span className="absolute -top-5 -right-5 bg-red-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-white">
                {itemCount()}
              </span>
            </div>
          </Button>
        </SheetTrigger>

        {/* CONTENIDO DEL SHEET */}
        <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
          <div className="border-b">
            <SheetHeader>
              <SheetTitle>Pedidos</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4 custom-scroll">
            {items.map((item) => (
              <div
                key={item.tempId}
                className="shadow-sm rounded-xl p-4 flex justify-between items-start"
              >
                {/* INFO DEL PRODUCTO */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold ">{item.product.name}</span>
                  </div>

                  {/* VARIANTES */}
                  {item.variantsDetailString && (
                    <p className="text-xs ml-6">
                      + {item.variantsDetailString}
                    </p>
                  )}

                  {/* NOTAS */}
                  {item.notes && (
                    <p className="text-xs text-orange-600 italic ml-6">
                      Nota: {item.notes}
                    </p>
                  )}

                  {/* PRECIO */}
                  <p className="ml-6 mt-1 font-bold ">
                    S/ {item.subtotal.toFixed(2)}
                  </p>
                </div>

                {/* ACCIONES */}
                <div className="flex flex-col gap-3 pl-4">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => removeItem(item.tempId)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <SheetFooter>
            <div className="w-full p-6 border-t space-y-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>S/ {total().toFixed(2)}</span>
              </div>

              <Button
                className="w-full text-lg cursor-pointer rounded-xl bg-green-600 hover:bg-green-700"
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

      {/* MODAL PARA EDITAR ITEM */}
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
