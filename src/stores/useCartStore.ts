import type { CartItem, Product } from "@/features/orders/types/catalog.types";
import { create } from "zustand";

interface CartState {
  tableId: string | null;
  items: CartItem[];

  // Acciones
  setTableId: (id: string) => void;
  addItem: (
    product: Product,
    quantity: number,
    notes: string,
    variants: any[]
  ) => void;
  removeItem: (tempId: string) => void;
  clearCart: () => void;

  // Getters computados
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  tableId: null,
  items: [],

  setTableId: (id) => set({ tableId: id }),

  addItem: (product, quantity, notes, variants) => {
    // Calcular el string para el backend
    const variantsDetailString = variants.map((v) => v.name).join(", ");

    // Calcular subtotal (Precio base + Extras) * Cantidad
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

  removeItem: (tempId) => {
    set((state) => ({ items: state.items.filter((i) => i.tempId !== tempId) }));
  },

  clearCart: () => set({ items: [], tableId: null }),

  total: () => get().items.reduce((acc, item) => acc + item.subtotal, 0),
  itemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
}));
