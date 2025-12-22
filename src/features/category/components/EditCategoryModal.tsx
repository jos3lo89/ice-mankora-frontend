import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useFloors } from "@/features/floors/hooks/useFloors";
import { useUpdateCategory } from "../hooks/useCategories";
import type { Category } from "../types/category.types";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  parentId: z.string().optional(),
  floorIds: z.array(z.string()).min(1, "Debe seleccionar al menos un piso"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  category: Category;
  categories: Category[];
}

export const EditCategoryModal = ({
  open,
  onClose,
  category,
  categories,
}: Props) => {
  const [selectedFloors, setSelectedFloors] = useState<string[]>(
    category.floors.map((f) => f.id),
  );
  const [parentValue, setParentValue] = useState<string>(
    category.parentId || "",
  );

  const { data: floors } = useFloors();
  const updateMutation = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      parentId: category.parentId || "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId || "",
      });
      setSelectedFloors(category.floors.map((f) => f.id));
      setParentValue(category.parentId || "");
    }
  }, [category, reset]);

  const handleFloorToggle = (floorId: string) => {
    setSelectedFloors((prev) =>
      prev.includes(floorId)
        ? prev.filter((id) => id !== floorId)
        : [...prev, floorId],
    );
  };

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(
      {
        id: category.id,
        data: {
          ...data,
          floorIds: selectedFloors,
          parentId: parentValue || undefined,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  // Filtrar categorías para evitar seleccionar a sí misma o sus hijas
  const availableParents = categories.filter(
    (cat) => cat.id !== category.id && cat.parentId !== category.id,
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
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
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* <div>
            <Label htmlFor="parentId">Categoría Padre (Opcional)</Label>
            <Select
              defaultValue={category.parentId || ""}
              onValueChange={(value) => setValue("parentId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sin categoría padre" />
              </SelectTrigger>
              <SelectContent>
                {availableParents.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
          <div>
            <Label htmlFor="parentId">Categoría Padre (Opcional)</Label>
            <div className="flex gap-2">
              <Select value={parentValue} onValueChange={setParentValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin categoría padre" />
                </SelectTrigger>
                <SelectContent>
                  {availableParents.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {parentValue && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setParentValue("")}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label>Pisos Disponibles *</Label>
            <div className="space-y-2 mt-2">
              {floors?.map((floor) => (
                <div key={floor.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`floor-${floor.id}`}
                    checked={selectedFloors.includes(floor.id)}
                    onCheckedChange={() => handleFloorToggle(floor.id)}
                  />
                  <label
                    htmlFor={`floor-${floor.id}`}
                    className="text-sm font-medium leading-none"
                  >
                    {floor.name} (Nivel {floor.level})
                  </label>
                </div>
              ))}
            </div>
            {selectedFloors.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Debe seleccionar al menos un piso
              </p>
            )}
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
