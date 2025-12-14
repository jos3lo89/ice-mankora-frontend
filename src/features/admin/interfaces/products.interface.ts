export interface ProductsI {
  id: string
  name: string
  description: string | null
  price: string
  categoryId: string
  isStockManaged: boolean
  stockDaily: number
  stockWarehouse: number
  taxType: string
  igvRate: string
  codigoSunat: any
  isActive: boolean
  createdAt: string
  updatedAt: string
  variants: ProductVariant[]
  category: Category
}

export interface Category {
  id: string
  name: string
  slug: string
}

interface ProductVariant {
  id: string
  productId: string
  name: string
  priceExtra: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
