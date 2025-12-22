import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { Plus, FolderOpen, Package, Loader2, ChevronRight } from "lucide-react";
import type { Category } from "../types/category.types";
import { useCategories, useDeleteCategory } from "../hooks/useCategories";
import { CreateCategoryModal } from "../components/CreateCategoryModal";
import { EditCategoryModal } from "../components/EditCategoryModal";
import { ProductsList } from "../components/ProductsList";
import { CreateProductModal } from "../components/CreateProductModal";

export default function CategoriesManagementPage() {
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { data: categories, isLoading } = useCategories();
  useEffect(() => {
    if (selectedCategory) {
      // Buscar la categoría actualizada en la lista
      const updatedCategory = categories?.find(
        (c) => c.id === selectedCategory.id,
      );
      if (updatedCategory) {
        setSelectedCategory(updatedCategory);
      }
    }
  }, [categories, selectedCategory]);

  const deleteMutation = useDeleteCategory();

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      deleteMutation.mutate(deletingCategory.id, {
        onSuccess: () => {
          setDeletingCategory(null);
          if (selectedCategory?.id === deletingCategory.id) {
            setSelectedCategory(null);
          }
        },
      });
    }
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Gestión de Categorías y Productos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las categorías y productos de tu negocio
          </p>
        </div>
        <Button onClick={() => setCreateCategoryOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo: Lista de Categorías */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Categorías ({categories?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories?.map((category) => (
              <div
                key={category.id}
                className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedCategory?.id === category.id
                    ? "bg-primary/10 border-primary"
                    : ""
                }`}
                onClick={() => handleSelectCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.parentId && (
                        <Badge variant="outline" className="text-xs">
                          Sub
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-1">
                      {category.floors.map((floor) => (
                        <Badge
                          key={floor.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          Piso {floor.level}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category._count?.products || 0} productos
                    </p>
                  </div>

                  {/* <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(category);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingCategory(category);
                        }}
                        className="text-red-600"
                        disabled={
                          (category._count?.products || 0) > 0 ||
                          (category._count?.children || 0) > 0
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>
              </div>
            ))}

            {categories?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay categorías creadas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel Derecho: Detalles de Categoría y Productos */}
        <Card className="lg:col-span-2">
          {selectedCategory ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedCategory.parent && (
                        <>
                          <span className="text-muted-foreground">
                            {selectedCategory.parent.name}
                          </span>
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                      {selectedCategory.name}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      {selectedCategory.floors.map((floor) => (
                        <Badge key={floor.id} variant="secondary">
                          {floor.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => setCreateProductOpen(true)} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Producto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="products">
                  <TabsList className="w-full">
                    <TabsTrigger value="products" className="flex-1">
                      <Package className="mr-2 h-4 w-4" />
                      Productos ({selectedCategory.products?.length || 0})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="products" className="mt-4">
                    <ProductsList
                      products={selectedCategory.products || []}
                      categories={categories || []}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-12">
              <div className="text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Selecciona una categoría
                </h3>
                <p className="text-sm text-muted-foreground">
                  Haz clic en una categoría para ver y gestionar sus productos
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Modales */}
      <CreateCategoryModal
        open={createCategoryOpen}
        onClose={() => setCreateCategoryOpen(false)}
        categories={categories || []}
      />

      {editingCategory && (
        <EditCategoryModal
          open={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
          categories={categories || []}
        />
      )}

      {selectedCategory && (
        <CreateProductModal
          open={createProductOpen}
          onClose={() => setCreateProductOpen(false)}
          categories={categories || []}
          defaultCategoryId={selectedCategory.id}
        />
      )}

      {/* Dialog de Confirmación de Eliminación */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la categoría "
              {deletingCategory?.name}". Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
