import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../hooks/useCatalog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { OrderSummary } from "../components/OrderSummary";
import { useCartStore } from "@/stores/useCartStore";
import type { Product } from "../types/catalog.types";
import SpinnerLoading from "@/components/SpinnerLoading";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function TakeOrderPage() {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("tableId");

  const { categoriesQuery, productsQuery } = useCatalog();
  const setStoreTableId = useCartStore((state) => state.setTableId);

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    if (tableId) {
      setStoreTableId(tableId);
    }
  }, [tableId, setStoreTableId]);

  const categories = categoriesQuery.data || [];
  const products = productsQuery.data || [];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "ALL" || product.categoryId === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (productsQuery.isLoading) return <SpinnerLoading />;

  return (
    <div className="relative min-h-[calc(100vh-80px)] pb-20">
      {/* BUSCADOR */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar helado, plato..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* CATEGORÍAS — DESKTOP */}
      <div className="hidden lg:block">
        <Tabs
          defaultValue="ALL"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="w-full flex gap-2 overflow-x-auto h-auto p-1 bg-transparent">
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
      </div>

      <div className="lg:hidden flex justify-between items-center mb-4">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex gap-2 bg-transparent">
            <TabsTrigger
              value="ALL"
              className="rounded-full border px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Todos
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Sheet open={openFilter} onOpenChange={setOpenFilter}>
          <SheetTrigger className="px-4 py-2 bg-primary text-white rounded-full">
            Filtrar
          </SheetTrigger>

          <SheetContent side="bottom" className="h-[60%] p-4">
            <SheetHeader>
              <SheetTitle>Categorías</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>

            <div className="grid grid-cols-2 gap-3 overflow-y-auto mt-4 max-h-[300px] pr-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="rounded-lg bg-muted hover:bg-primary hover:text-white py-3 text-center transition-all"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenFilter(false);
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* GRID DE PRODUCTOS ADAPTADO */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No se encontraron productos
        </div>
      )}

      {/* MODAL DE PRODUCTOS */}
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
