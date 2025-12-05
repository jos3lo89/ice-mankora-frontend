import type { Product } from "../types/catalog.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  product: Product;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: Props) => {
  // Verificamos si hay stock (si es manejado)
  const hasStock = !product.isStockManaged || product.stockDaily > 0;

  return (
    <Card
      onClick={hasStock ? onClick : undefined}
      className={`
        relative overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-95
        ${!hasStock ? "opacity-50 grayscale cursor-not-allowed" : ""}
      `}
    >
      <div className="p-4 flex flex-col justify-between h-32">
        <div>
          <h3 className="font-bold text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          {!hasStock && (
            <Badge variant="destructive" className="mt-1 text-[10px]">
              Agotado
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-end">
          <span className="font-bold text-lg text-primary">
            S/ {Number(product.price).toFixed(2)}
          </span>
          {product.isStockManaged && (
            <span className="text-xs text-muted-foreground">
              {product.stockDaily} disp.
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
