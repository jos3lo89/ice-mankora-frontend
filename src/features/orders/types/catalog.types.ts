export interface ProductVariant {
  id: string;
  name: string;
  priceExtra: number;
}

export interface Product {
  id: string;
  name: string;
  price: number; // El precio base que viene del backend (decimal string o number)
  stockDaily: number;
  isStockManaged: boolean;
  categoryId: string;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Lo que guardamos en el carrito
export interface CartItem {
  tempId: string; // ID temporal para identificarlo en el array (uuid local)
  product: Product;
  quantity: number;
  notes?: string;
  selectedVariants: ProductVariant[]; // Para mostrar en el resumen
  variantsDetailString: string; // Lo que se manda al backend ("Sabor: Fresa")
  subtotal: number;
}
