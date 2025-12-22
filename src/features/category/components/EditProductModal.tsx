import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateProduct } from "../hooks/useProducts";
import type { Category, Product } from "../types/category.types";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  categoryId: z.string().min(1, "Debe seleccionar una categoría"),
  isStockManaged: z.boolean(),
  stockDaily: z.number().min(0),
  stockWarehouse: z.number().min(0),
  taxType: z.string(),
  igvRate: z.number().min(0).max(1),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product;
  categories: Category[];
}

export const EditProductModal = ({
  open,
  onClose,
  product,
  categories,
}: Props) => {
  const updateMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const isStockManaged = watch("isStockManaged");

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        price: Number(product.price),
        categoryId: product.categoryId,
        isStockManaged: product.isStockManaged,
        stockDaily: product.stockDaily,
        stockWarehouse: product.stockWarehouse,
        taxType: product.taxType,
        igvRate: Number(product.igvRate),
        isActive: product.isActive,
      });
    }
  }, [product, reset]);

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(
      { id: product.id, data },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <div>
            <Label htmlFor="price">Precio (S/) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="categoryId">Categoría *</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label htmlFor="isStockManaged">Gestionar Stock</Label>
              <p className="text-xs text-muted-foreground">
                Habilitar control de inventario
              </p>
            </div>
            <Switch
              id="isStockManaged"
              checked={isStockManaged}
              onCheckedChange={(checked) => setValue("isStockManaged", checked)}
            />
          </div>

          {isStockManaged && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stockDaily">Stock Diario</Label>
                <Input
                  id="stockDaily"
                  type="number"
                  {...register("stockDaily", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="stockWarehouse">Stock Almacén</Label>
                <Input
                  id="stockWarehouse"
                  type="number"
                  {...register("stockWarehouse", { valueAsNumber: true })}
                />
              </div>
            </div>
          )}

          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxType">Tipo Impuesto</Label>
              <Select
                value={watch("taxType")}
                onValueChange={(value) => setValue("taxType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GRAVADO">Gravado (18%)</SelectItem>
                  <SelectItem value="EXONERADO">Exonerado</SelectItem>
                  <SelectItem value="INAFECTO">Inafecto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="igvRate">Tasa IGV</Label>
              <Input
                id="igvRate"
                type="number"
                step="0.01"
                {...register("igvRate", { valueAsNumber: true })}
              />
            </div>
          </div> */}

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label htmlFor="isActive">Producto Activo</Label>
              <p className="text-xs text-muted-foreground">
                Disponible para la venta
              </p>
            </div>
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
