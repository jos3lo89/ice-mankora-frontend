import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductsI } from "../types/product.interface";

interface Props {
  product: ProductsI;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: Props) => {
  const hasStock = !product.isStockManaged || product.stockDaily > 0;

  return (
    <Card
      onClick={hasStock ? onClick : undefined}
      className={`cursor-pointer transition-all ${
        !hasStock ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="p-1 flex flex-col items-center gap-2">
        <div>
          <h3 className="font-bold text-sm leading-tight line-clamp-2 text-center">
            {product.name}
          </h3>
          {!hasStock && (
            <Badge variant="destructive" className="mt-1">
              Agotado
            </Badge>
          )}
        </div>

        <div className="flex  flex-col gap-2 items-center">
          <span
            className={`font-bold text-lg text-primary ${
              !hasStock ? "grayscale" : ""
            }`}
          >
            S/ {Number(product.price).toFixed(2)}
          </span>
          {product.isStockManaged && (
            <span
              className={`text-sm text-muted-foreground ${
                !hasStock ? "grayscale" : ""
              }`}
            >
              {product.stockDaily} disp.
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
