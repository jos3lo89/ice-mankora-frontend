import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCategory } from "../hooks/useCategories";
import type { Category } from "../types/category.types";
import { useFloors } from "@/features/floors/hooks/useFloors";

// 1. Esquema de validación
const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  parentId: z.string().optional().nullable(),
  floorIds: z.array(z.string()).min(1, "Debe seleccionar al menos un piso"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  categories: Category[];
}

export const CreateCategoryModal = ({ open, onClose, categories }: Props) => {
  const { data: floors } = useFloors();
  const createMutation = useCreateCategory();

  // 2. Configuración del Formulario
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control, // Necesario para componentes de Shadcn
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      parentId: null,
      floorIds: [],
    },
  });

  // Watch para generar el slug automáticamente
  const nameValue = watch("name");

  useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameValue, setValue]);

  const onSubmit = (data: FormData) => {
    // 3. LOG COMPLETO DE LA INFORMACIÓN
    console.log("🚀 Datos del formulario:", data);

    createMutation.mutate(
      {
        ...data,
        parentId: data.parentId || undefined,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Categoría</DialogTitle>
          <DialogDescription>
            Completa los datos para crear una nueva categoría.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ej: Helados"
              autoFocus
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} placeholder="helados" />
            {errors.slug && (
              <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* Categoría Padre */}
          <div>
            <Label>Categoría Padre (Opcional)</Label>
            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sin categoría padre" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange(null)}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              )}
            />
          </div>

          {/* Selección de Pisos (Checkboxes) */}
          <div className="space-y-2">
            <Label>Asignar a Pisos *</Label>
            <div className="grid grid-cols-2 gap-2 border p-3 rounded-md">
              {floors?.map((floor) => (
                <Controller
                  key={floor.id}
                  name="floorIds"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={floor.id}
                        checked={field.value?.includes(floor.id)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value, floor.id]
                            : field.value.filter((id) => id !== floor.id);
                          field.onChange(updatedValue);
                        }}
                      />
                      <label
                        htmlFor={floor.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {floor.name}
                      </label>
                    </div>
                  )}
                />
              ))}
            </div>
            {errors.floorIds && (
              <p className="text-xs text-red-500 mt-1">
                {errors.floorIds.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creando..." : "Crear Categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
