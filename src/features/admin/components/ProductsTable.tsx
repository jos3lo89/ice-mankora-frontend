import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductsI } from "../interfaces/products.interface";
import { updateProductStatus } from "../service/products.service";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ProductsTableProps {
  products: ProductsI[];
  onEdit: (product: ProductsI) => void;
}

export function ProductsTable({ products, onEdit }: ProductsTableProps) {
  const queryClient = useQueryClient();
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Record<string, boolean>
  >({});

  // Mutation para actualizar el estado
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateProductStatus(id, isActive),
    onMutate: async ({ id, isActive }) => {
      // Guardar el estado optimista
      setOptimisticUpdates((prev) => ({ ...prev, [id]: isActive }));

      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ["admin-products"] });

      // Snapshot del estado anterior
      const previousProducts = queryClient.getQueryData<ProductsI[]>([
        "admin-products",
      ]);

      // Actualización optimista
      queryClient.setQueryData<ProductsI[]>(["admin-products"], (old) =>
        old?.map((product) =>
          product.id === id ? { ...product, isActive } : product
        )
      );

      return { previousProducts };
    },
    onError: (error, { id }, context) => {
      console.log(error);

      // Revertir el cambio optimista
      if (context?.previousProducts) {
        queryClient.setQueryData(["admin-products"], context.previousProducts);
      }
      setOptimisticUpdates((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });

      toast.error("No se pudo actualizar el estado del producto");
    },
    onSuccess: (_, { id, isActive }) => {
      // Limpiar el estado optimista
      setOptimisticUpdates((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });

      toast(`Producto ${isActive ? "activado" : "desactivado"} correctamente`);
    },
    onSettled: () => {
      // Refetch para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const handleToggleStatus = (product: ProductsI) => {
    const newStatus = !product.isActive;
    statusMutation.mutate({ id: product.id, isActive: newStatus });
  };

  const getDisplayStatus = (product: ProductsI) => {
    // Mostrar estado optimista si existe, sino el estado real
    return optimisticUpdates[product.id] ?? product.isActive;
  };

  return (
    <div className="w-full overflow-hidden rounded-md border">
      <ScrollArea>
        <Table className="min-w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock Diario</TableHead>
              <TableHead>Stock Almacén</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isActive = getDisplayStatus(product);
              const isUpdating = product.id in optimisticUpdates;

              return (
                <TableRow
                  key={product.id}
                  className={isUpdating ? "opacity-60" : ""}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>S/ {Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    {product.isStockManaged ? product.stockDaily : "N/A"}
                  </TableCell>
                  <TableCell>
                    {product.isStockManaged ? product.stockWarehouse : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => handleToggleStatus(product)}
                        disabled={isUpdating}
                      />
                      <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
