import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, MoreVertical, Trash2, Package, DollarSign } from "lucide-react";
import type { Category, Product } from "../types/category.types";
import { useDeleteProduct } from "../hooks/useProducts";
import { EditProductModal } from "./EditProductModal";

interface Props {
  products: Product[];
  categories: Category[];
}

export const ProductsList = ({ products, categories }: Props) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    if (deletingProduct) {
      deleteMutation.mutate(deletingProduct.id, {
        onSuccess: () => {
          setDeletingProduct(null);
        },
      });
    }
  };

  if (products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          No hay productos en esta categoría
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setDeletingProduct(product)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Desactivar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Precio
                </span>
                <span className="text-lg font-bold text-primary">
                  S/ {Number(product.price).toFixed(2)}
                </span>
              </div>

              {product.isStockManaged && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stock Diario</span>
                  <Badge variant="outline">{product.stockDaily}</Badge>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <Badge variant="outline">{product.taxType}</Badge>
              </div>

              {product._count && product._count.orderItems > 0 && (
                <p className="text-xs text-muted-foreground pt-1">
                  Vendido {product._count.orderItems} veces
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Edición */}
      {editingProduct && (
        <EditProductModal
          open={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          categories={categories}
        />
      )}

      {/* Dialog de Confirmación de Eliminación */}
      <AlertDialog
        open={!!deletingProduct}
        onOpenChange={() => setDeletingProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              El producto "{deletingProduct?.name}" será desactivado y ya no
              estará disponible para la venta. Los pedidos existentes no se
              verán afectados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
