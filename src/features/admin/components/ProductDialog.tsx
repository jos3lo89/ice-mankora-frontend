import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ProductsI } from "../interfaces/products.interface";
import { createProduct, updateProduct } from "../service/products.service";
import { toast } from "sonner";
import { useCategories } from "../hooks/useProducts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El precio debe ser mayor a 0",
  }),
  categoryId: z.string().min(1, "La categoría es requerida"),
  isStockManaged: z.boolean(),
  stockDaily: z.number().min(0, "El stock no puede ser negativo"),
  stockWarehouse: z.number().min(0, "El stock no puede ser negativo"),
  taxType: z.string(),
  igvRate: z.string(),
  isActive: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductsI | null;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
}: ProductDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!product;

  const { data: categories } = useCategories();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      categoryId: "",
      isStockManaged: true,
      stockDaily: 0,
      stockWarehouse: 0,
      taxType: "GRAVADO",
      igvRate: "0.18",
      isActive: true,
    },
  });

  // Cargar datos del producto al editar
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || "",
        price: product.price,
        categoryId: product.categoryId,
        isStockManaged: product.isStockManaged,
        stockDaily: product.stockDaily,
        stockWarehouse: product.stockWarehouse,
        taxType: product.taxType,
        igvRate: product.igvRate,
        isActive: product.isActive,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: "0",
        categoryId: "",
        isStockManaged: true,
        stockDaily: 0,
        stockWarehouse: 0,
        taxType: "GRAVADO",
        igvRate: "0.18",
        isActive: true,
      });
    }
  }, [product, form]);

  // Mutation para crear/actualizar
  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (isEditing) {
        return updateProduct(product.id, values);
      } else {
        return createProduct(values);
      }
    },
    onMutate: async (values) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ["admin-products"] });

      // Snapshot del estado anterior
      const previousProducts = queryClient.getQueryData<ProductsI[]>([
        "admin-products",
      ]);

      if (isEditing) {
        // Actualización optimista para edición
        queryClient.setQueryData<ProductsI[]>(["admin-products"], (old) =>
          old?.map((p) =>
            p.id === product.id
              ? { ...p, ...values, price: values.price.toString() }
              : p
          )
        );
      } else {
        // Actualización optimista para creación (agregar temporalmente)
        const tempProduct: ProductsI = {
          id: `temp-${Date.now()}`,
          ...values,
          description: values.description || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          variants: [],
          category: { id: values.categoryId, name: "Categoría", slug: "" },
          codigoSunat: null,
        };
        queryClient.setQueryData<ProductsI[]>(["admin-products"], (old) =>
          old ? [...old, tempProduct] : [tempProduct]
        );
      }

      return { previousProducts };
    },
    onError: (error, _, context) => {
      // Revertir el cambio optimista
      console.log(error);

      if (context?.previousProducts) {
        queryClient.setQueryData(["admin-products"], context.previousProducts);
      }

      toast.error(
        `No se pudo ${isEditing ? "actualizar" : "crear"} el producto`
      );
    },
    onSuccess: () => {
      toast.success(
        `Producto ${isEditing ? "actualizado" : "creado"} correctamente`
      );

      onOpenChange(false);
      form.reset();
    },
    onSettled: () => {
      // Invalidar y refetch para obtener datos reales del servidor
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    console.log("Datos del formulario:", values);
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del producto"
              : "Completa el formulario para agregar un nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Copa Mankora Especial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del producto..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      {/* <Input
                        type="number"
                        value={field.value || ""}
                        step="0.01"
                        placeholder="0.00"
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? "" : value);
                        }}
                      /> */}
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories && categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-categories" disabled>
                            No hay categorías disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isStockManaged"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Gestionar Stock</FormLabel>
                    <FormDescription>
                      Activar control de inventario para este producto
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("isStockManaged") && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stockDaily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Diario</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? "" : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockWarehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Almacén</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? "" : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Producto Activo</FormLabel>
                    <FormDescription>
                      El producto estará visible en el catálogo
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Guardando..."
                  : isEditing
                  ? "Actualizar"
                  : "Crear Producto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
