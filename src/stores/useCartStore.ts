import type {
  CartItem,
  Product,
  ProductVariant,
} from "@/features/orders/types/catalog.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  tableId: string | null;
  items: CartItem[];

  updateItem: (
    tempId: string,
    data: {
      quantity?: number;
      notes?: string;
      variants?: ProductVariant[];
    }
  ) => void;

  setTableId: (id: string) => void;
  addItem: (
    product: Product,
    quantity: number,
    notes: string,
    variants: any[]
  ) => void;
  removeItem: (tempId: string) => void;
  clearCart: () => void;

  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tableId: null,
      items: [],

      setTableId: (id) => set({ tableId: id }),

      addItem: (product, quantity, notes, variants) => {
        const variantsDetailString = variants.map((v) => v.name).join(", ");

        const extrasTotal = variants.reduce(
          (acc, v) => acc + Number(v.priceExtra),
          0
        );

        const unitPrice = Number(product.price) + extrasTotal;

        const newItem: CartItem = {
          tempId: crypto.randomUUID(),
          product,
          quantity,
          notes,
          selectedVariants: variants,
          variantsDetailString,
          subtotal: unitPrice * quantity,
        };

        set((state) => ({ items: [...state.items, newItem] }));
      },

      updateItem: (tempId, data) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.tempId !== tempId) return item;

            const updated = {
              ...item,
              quantity: data.quantity ?? item.quantity,
              notes: data.notes ?? item.notes,
              selectedVariants: data.variants ?? item.selectedVariants,
            };

            const extrasTotal = updated.selectedVariants.reduce(
              (acc, v) => acc + Number(v.priceExtra),
              0
            );

            updated.variantsDetailString = updated.selectedVariants
              .map((v) => v.name)
              .join(", ");

            updated.subtotal =
              (Number(updated.product.price) + extrasTotal) * updated.quantity;

            return updated;
          }),
        }));
      },

      removeItem: (tempId) => {
        set((state) => ({
          items: state.items.filter((i) => i.tempId !== tempId),
        }));
      },

      clearCart: () => set({ items: [], tableId: null }),

      total: () => get().items.reduce((acc, item) => acc + item.subtotal, 0),

      itemCount: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: "cart-storage", // nombre en localStorage
      partialize: (state) => ({
        tableId: state.tableId,
        items: state.items,
      }),
    }
  )
);
