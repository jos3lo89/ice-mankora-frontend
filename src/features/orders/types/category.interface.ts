export interface CategoryI {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: string;
//   categoryId: string;
//   isStockManaged: boolean;
//   stockDaily: number;
//   stockWarehouse: number;
//   taxType: string;
//   igvRate: string;
//   codigoSunat: any;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Floor {
//   id: string;
//   name: string;
//   level: number;
//   printerIp: string;
//   printerPort: number;
//   createdAt: string;
//   updatedAt: string;
// }
