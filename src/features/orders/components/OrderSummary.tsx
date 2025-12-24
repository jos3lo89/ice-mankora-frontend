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
import { ShoppingBasket, Trash2, Send, Pencil } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useCreateOrder } from "../hooks/useCatalog";
import { Badge } from "@/components/ui/badge";
import { InlineCartEditor } from "./InlineCartEditor";
import { useAddItems } from "../hooks/useOrders";
import { useSearchParams } from "react-router-dom";

export const OrderSummary = () => {
  const { items, total, itemCount, removeItem, table } = useCartStore();
  const { mutate: sendOrder, isPending } = useCreateOrder();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { mutate: addItems, isPending: isPendingItems } = useAddItems();

  const existingOrderId = searchParams.get("orderId");

  const handleSend = () => {
    const itemsPayload = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      notes: item.notes || null,
      variantIds: item.selectedVariants.map((v) => v.id),
    }));

    if (existingOrderId) {
      addItems({
        orderId: existingOrderId,
        items: itemsPayload,
      });
    } else {
      if (!table?.id) return;
      const payload = {
        tableId: table.id,
        items: itemsPayload,
      };
      sendOrder(payload);
    }
  };

  if (itemCount() === 0) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative mr-1">
          <ShoppingBasket size={24} />
          {itemCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-background">
              {itemCount()}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
        <div className="border-b">
          <SheetHeader>
            <SheetTitle>
              Pedidos <Badge variant="outline">{table?.name}</Badge>
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4 custom-scroll pb-20">
          {items.map((item) => {
            const isEditing = editingItemId === item.tempId;

            if (isEditing) {
              return (
                <InlineCartEditor
                  key={item.tempId}
                  item={item}
                  onCancel={() => setEditingItemId(null)}
                  onSave={() => setEditingItemId(null)}
                />
              );
            }

            return (
              <div
                key={item.tempId}
                className="shadow-sm border rounded-xl p-4 flex justify-between items-start "
              >
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
                    <p className="text-xs text-secondary italic mt-1 ml-1">
                      Nota: {item.notes}
                    </p>
                  )}

                  <p className="mt-2 font-bold">
                    S/ {item.subtotal.toFixed(2)}
                  </p>
                </div>

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
              className="w-full text-lg cursor-pointer rounded-xl bg-green-700 hover:bg-green-800 h-12"
              onClick={handleSend}
              disabled={isPending || isPendingItems}
            >
              {isPending || isPendingItems ? (
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
