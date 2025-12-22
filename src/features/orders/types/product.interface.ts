export interface ProductsI {
  id: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  isStockManaged: boolean;
  stockDaily: number;
  stockWarehouse: number;
  taxType: string;
  igvRate: string;
  codigoSunat: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variants: VariantsI[];
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface VariantsI {
  id: string;
  name: string;
  isActive: boolean;
  priceExtra: string;
  productId: string;
}
