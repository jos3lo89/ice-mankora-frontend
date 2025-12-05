import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCatalog } from "../hooks/useCatalog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { OrderSummary } from "../components/OrderSummary";
import { useCartStore } from "@/stores/useCartStore";
import type { Product } from "../types/catalog.types";
import { Button } from "@/components/ui/button";

export default function TakeOrderPage() {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("tableId");
  const navigate = useNavigate();

  const { categoriesQuery, productsQuery } = useCatalog();
  const setStoreTableId = useCartStore((state) => state.setTableId);
  // const clearCart = useCartStore((state) => state.clearCart);

  // Estados Locales
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Inicializar Store
  useEffect(() => {
    if (tableId) {
      // Si cambiamos de mesa, ¿limpiamos carrito?
      // Por ahora asumimos que sí para evitar mezclas
      setStoreTableId(tableId);
    }
  }, [tableId, setStoreTableId]);

  const categories = categoriesQuery.data || [];
  const products = productsQuery.data || [];

  // Filtrado de Productos
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "ALL" || product.categoryId === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (productsQuery.isLoading)
    return <div className="p-10">Cargando Carta...</div>;

  return (
    <div className="relative min-h-[calc(100vh-80px)] pb-20">
      {/* Header Navegación */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="text-xl font-bold">Tomar Pedido</h1>
      </div>

      {/* Buscador */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar helado, plato..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categorías (Tabs) */}
      <Tabs
        defaultValue="ALL"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 gap-2 bg-transparent">
          <TabsTrigger
            value="ALL"
            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full border px-4 py-2"
          >
            Todos
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full border px-4 py-2 whitespace-nowrap"
            >
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Grid de Productos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {/* Mensaje Vacío */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No se encontraron productos
        </div>
      )}

      {/* MODAL DE SELECCIÓN */}
      <ProductModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* CARRITO FLOTANTE */}
      <OrderSummary />
    </div>
  );
}
