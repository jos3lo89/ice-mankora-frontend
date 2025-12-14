import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowBigLeft,
  ArrowBigRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpinnerLoading from "@/components/SpinnerLoading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProducts } from "../hooks/useProducts";
import type { ProductsI } from "../interfaces/products.interface";
import { ProductsTable } from "../components/ProductsTable";
import { ProductDialog } from "../components/ProductDialog";

const ProductsPage = () => {
  const { data, error, isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductsI | null>(null);

  const itemsPerPage = 10;

  // Filtrar productos
  const filteredProducts =
    data?.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? product.isActive
          : !product.isActive;
      return matchesSearch && matchesStatus;
    }) || [];

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleEdit = (product: ProductsI) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SpinnerLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error al cargar los productos. Por favor, intenta nuevamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex gap-2 z-1">
          <Search className="absolute  left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: "all" | "active" | "inactive") => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los productos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Mostrando {paginatedProducts.length} de {filteredProducts.length}{" "}
          productos
        </p>
        {filteredProducts.length > itemsPerPage && (
          <p>
            Página {currentPage} de {totalPages}
          </p>
        )}
      </div>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron productos</p>
        </div>
      ) : (
        <ProductsTable products={paginatedProducts} onEdit={handleEdit} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ArrowBigLeft />
          </Button>
          <div className="flex items-center gap-1">
            {(() => {
              const pages = [];
              const showEllipsisStart = currentPage > 3;
              const showEllipsisEnd = currentPage < totalPages - 2;

              // Siempre mostrar la primera página
              pages.push(
                <Button
                  key={1}
                  variant={currentPage === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  className="min-w-[40px]"
                >
                  1
                </Button>
              );

              // Puntos suspensivos al inicio
              if (showEllipsisStart) {
                pages.push(
                  <span key="ellipsis-start" className="px-2">
                    ...
                  </span>
                );
              }

              // Páginas del medio
              const startPage = Math.max(2, currentPage - 1);
              const endPage = Math.min(totalPages - 1, currentPage + 1);

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                    className="min-w-[40px]"
                  >
                    {i}
                  </Button>
                );
              }

              // Puntos suspensivos al final
              if (showEllipsisEnd) {
                pages.push(
                  <span key="ellipsis-end" className="px-2">
                    ...
                  </span>
                );
              }

              // Siempre mostrar la última página (si hay más de 1 página)
              if (totalPages > 1) {
                pages.push(
                  <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="min-w-[40px]"
                  >
                    {totalPages}
                  </Button>
                );
              }

              return pages;
            })()}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ArrowBigRight />
          </Button>
        </div>
      )}
      {/* Dialog */}
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductsPage;
