import type { ProductsI } from "./product.interface";

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
  description: string;
  price: number;
  stockDaily: number;
  categoryId: string;
  isStockManaged: boolean;
  stockWarehouse: number;
  taxType: string;
  igvRate: string;
  codigoSunat: string | null;
  isActive: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  tempId: string;
  product: ProductsI;
  quantity: number;
  notes?: string;
  selectedVariants: ProductVariant[];
  variantsDetailString: string;
  subtotal: number;
}
