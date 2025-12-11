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
  codigoSunat: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variants: any[];
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
