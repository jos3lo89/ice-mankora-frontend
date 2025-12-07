import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useActiveOrder } from "@/features/orders/hooks/useOrders";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core"; // Importante para columnas vacías
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  GripVertical,
  MoreVertical,
  Printer,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentModal } from "../components/PaymentModal";
import SpinnerLoading from "@/components/SpinnerLoading";
import { toast } from "sonner";

function SortableItem({ id, item }: { id: string; item: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 mb-2  rounded-lg border shadow-sm group touch-none"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-primary text-muted-foreground active:cursor-grabbing"
        >
          <GripVertical size={25} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{item.product.name}</p>
          <div className="flex gap-2 text-xs text-muted-foreground items-center">
            <Badge variant="outline" className="h-5 px-1 shrink-0">
              {item.quantity} un
            </Badge>
            {item.notes && (
              <span className="text-orange-500 truncate max-w-[120px]">
                {item.notes}
              </span>
            )}

            {item.variantsDetail}
          </div>
        </div>
      </div>
      <span className="font-semibold text-sm font-mono shrink-0 ml-2">
        S/ {(Number(item.price) * item.quantity).toFixed(2)}
      </span>
    </div>
  );
}

function DroppableContainer({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <CardContent
      ref={setNodeRef}
      className="flex-1 p-2 mx-1 mb-1 overflow-hidden flex flex-col min-h-[100px]"
    >
      {children}
    </CardContent>
  );
}

export default function SplitBillPage() {
  const { id: tableId } = useParams();
  // const navigate = useNavigate();
  const { data: order, isLoading } = useActiveOrder(tableId!);

  // Estado local
  const [columns, setColumns] = useState<{ [key: string]: any[] }>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Estado Modal Pago
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [activePaymentGroup, setActivePaymentGroup] = useState<{
    id: string;
    total: number;
    itemIds: string[];
  } | null>(null);

  // Inicializar
  useEffect(() => {
    if (order && Object.keys(columns).length === 0) {
      setColumns({ "cuenta-principal": order.items });
      setColumnOrder(["cuenta-principal"]);
    }
  }, [order]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Distancia mínima para evitar clicks accidentales
    useSensor(KeyboardSensor)
  );

  // --- LÓGICA DRAG & DROP ---

  const findContainer = (id: string) => {
    if (id in columns) return id;
    return Object.keys(columns).find((key) =>
      columns[key].find((i: any) => i.id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // CRÍTICO: Mover ítems ENTRE columnas MIENTRAS arrastras
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(overId as string);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setColumns((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((i) => i.id === active.id);
      const overIndex = overItems.findIndex((i) => i.id === overId);

      let newIndex;
      if (overId in prev) {
        // Estamos sobre el contenedor vacío (o el contenedor mismo)
        newIndex = overItems.length + 1;
      } else {
        // Estamos sobre otro ítem
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          activeItems[activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id as string);
    const overContainer = over ? findContainer(over.id as string) : null;

    if (activeContainer && overContainer && activeContainer === overContainer) {
      // Reordenar DENTRO de la misma columna
      const activeIndex = columns[activeContainer].findIndex(
        (i) => i.id === active.id
      );
      const overIndex = columns[overContainer].findIndex(
        (i) => i.id === over?.id
      );

      if (activeIndex !== overIndex) {
        setColumns((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(
            prev[activeContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    setActiveId(null);
  };

  // --- LÓGICA NEGOCIO ---

  const addAccount = () => {
    const newId = `cuenta-${columnOrder.length + 1}`;
    setColumns((prev) => ({ ...prev, [newId]: [] }));
    setColumnOrder((prev) => [...prev, newId]);
  };

  const handlePayGroup = (columnId: string) => {
    const items = columns[columnId];
    if (items.length === 0) {
      toast.error("Esta cuenta está vacía");
      return;
    }
    const total = items.reduce(
      (acc: number, item: any) => acc + Number(item.price) * item.quantity,
      0
    );
    const itemIds = items.map((i: any) => i.id);
    setActivePaymentGroup({ id: columnId, total, itemIds });
    setPaymentOpen(true);
  };

  const handleClosePayment = () => {
    setPaymentOpen(false);
    // Recargar página o invalidar query para refrescar items
    // navigate(0);
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  if (isLoading) return <SpinnerLoading />;

  return (
    <div>
      {/* HEADER */}
      <div className="pb-2 flex justify-between items-center">
        <h1 className="font-bold text-lg">Dividir Cuenta</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <AlertTriangle /> Opciones
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones de Riesgo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => toast.error("Funcionalidad pendiente")}
              >
                <Trash2 /> Se fue sin pagar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={addAccount} size="sm" className="gap-2 ">
            <Plus />
            <span className="hidden sm:inline">Nueva Cuenta</span>
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto p-4 sm:p-6 flex gap-6 items-start h-full box-border">
          {columnOrder.map((columnId) => {
            const items = columns[columnId];
            const total = items.reduce(
              (acc: number, item: any) =>
                acc + Number(item.price) * item.quantity,
              0
            );

            return (
              <Card
                key={columnId}
                className="w-[300px] sm:w-[350px] min-w-[300px] flex flex-col h-full max-h-[calc(100vh-100px)]"
              >
                <CardHeader className="flex flex-row items-center justify-between shrink-0">
                  <CardTitle className="text-base capitalize ">
                    {columnId.replace("-", " ")}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => toast.info("Pre-cuenta parcial...")}
                      >
                        <Printer className="mr-2 h-4 w-4" /> Pre-cuenta
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <div className="flex justify-between items-center px-6 text-xs text-muted-foreground font-medium shrink-0">
                  <span>Productos</span>
                  <span>{items.length} items</span>
                </div>

                <SortableContext
                  id={columnId}
                  items={items.map((i: any) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <DroppableContainer id={columnId}>
                    <ScrollArea className="h-72 w-full rounded-md pr-2">
                      <div className="space-y-2 p-1 min-h-[50px]">
                        {items.length === 0 ? (
                          <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                            Arrastra productos aquí
                          </div>
                        ) : (
                          items.map((item: any) => (
                            <SortableItem
                              key={item.id}
                              id={item.id}
                              item={item}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </DroppableContainer>
                </SortableContext>

                <CardFooter className="pt-4 border-t flex-col gap-3 pb-6 shrink-0">
                  <div className="flex justify-between w-full text-lg font-bold">
                    <span>Total</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full cursor-pointer"
                    variant={total > 0 ? "default" : "secondary"}
                    disabled={total === 0}
                    onClick={() => handlePayGroup(columnId)}
                  >
                    Cobrar Cuenta
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-2xl border w-[300px] opacity-90 cursor-grabbing">
              {/* Renderizamos una versión "flotante" del item para feedback visual */}
              <div className="flex items-center gap-3">
                <GripVertical size={18} />
                <p className="font-bold">Moviendo producto...</p>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {paymentOpen && activePaymentGroup && order && (
        <PaymentModal
          open={paymentOpen}
          onClose={handleClosePayment}
          orderId={order.id}
          totalAmount={activePaymentGroup.total}
          itemIds={activePaymentGroup.itemIds}
        />
      )}
    </div>
  );
}
