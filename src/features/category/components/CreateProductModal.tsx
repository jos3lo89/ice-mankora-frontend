// src/components/Products/CreateProductModal.tsx
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
import type { Category } from "../types/category.types";
import { useCreateProduct } from "../hooks/useProducts";

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
  categories: Category[];
  defaultCategoryId?: string;
}

export const CreateProductModal = ({
  open,
  onClose,
  categories,
  defaultCategoryId,
}: Props) => {
  const createMutation = useCreateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: defaultCategoryId || "",
      isStockManaged: true,
      stockDaily: 50,
      stockWarehouse: 100,
      taxType: "GRAVADO",
      igvRate: 0.18,
      isActive: true,
      price: 0,
    },
  });

  const isStockManaged = watch("isStockManaged");

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ej: Copa Mankora Especial"
              autoFocus
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descripción del producto"
              rows={3}
            />
          </div>

          {/* Precio */}
          <div>
            <Label htmlFor="price">Precio (S/) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
              defaultValue={0}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <Label htmlFor="categoryId">Categoría *</Label>
            <Select
              defaultValue={defaultCategoryId}
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Gestión de Stock */}
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
            <>
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
            </>
          )}

          {/* IGV */}
          {/* <div className="grid grid-cols-2 gap-4"> */}
          {/* <div>
              <Label htmlFor="taxType">Tipo Impuesto</Label>
              <Select
                defaultValue="GRAVADO"
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
            </div> */}
          {/* <div>
              <Label htmlFor="igvRate">Tasa IGV</Label>
              <Input
                id="igvRate"
                type="number"
                step="0.01"
                {...register("igvRate", { valueAsNumber: true })}
              />
            </div> */}
          {/* </div> */}

          {/* Estado */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label htmlFor="isActive">Producto Activo</Label>
              <p className="text-xs text-muted-foreground">
                Disponible para la venta
              </p>
            </div>
            <Switch
              id="isActive"
              defaultChecked
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creando..." : "Crear Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
