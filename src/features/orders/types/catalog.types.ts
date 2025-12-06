export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  priceExtra: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
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

export interface CartItem {
  tempId: string;
  product: Product;
  quantity: number;
  notes?: string;
  selectedVariants: ProductVariant[];
  variantsDetailString: string;
  subtotal: number;
}
