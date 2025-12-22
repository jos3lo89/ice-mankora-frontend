export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent?: {
    id: string;
    name: string;
  };
  children?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  floors: Array<{
    id: string;
    name: string;
    level: number;
  }>;
  products?: Product[];
  _count?: {
    products: number;
    children: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  isStockManaged: boolean;
  stockDaily: number;
  stockWarehouse: number;
  taxType: string;
  igvRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orderItems: number;
  };
}

export interface Floor {
  id: string;
  name: string;
  level: number;
}
