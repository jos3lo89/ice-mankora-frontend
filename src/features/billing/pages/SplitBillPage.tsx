// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useActiveOrder } from "@/features/orders/hooks/useOrders";
// import {
//   DndContext,
//   DragOverlay,
//   closestCorners,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
//   type DragStartEvent,
//   type DragOverEvent,
//   defaultDropAnimationSideEffects,
//   type DropAnimation,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   useSortable,
//   arrayMove,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { useDroppable } from "@dnd-kit/core";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import {
//   Plus,
//   GripVertical,
//   MoreVertical,
//   Printer,
//   Info,
//   CheckCircle2,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { PaymentModal } from "../components/PaymentModal";
// import SpinnerLoading from "@/components/SpinnerLoading";
// import { toast } from "sonner";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// function SortableItem({
//   id,
//   item,
//   isPaid,
// }: {
//   id: string;
//   item: any;
//   isPaid: boolean;
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id, disabled: isPaid });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     // opacity: isDragging ? 0.5 : 1,
//     opacity: isDragging ? 0.5 : isPaid ? 0.6 : 1,
//   };

//   const hasDetails = item.notes || item.variantsDetail;

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`flex items-center justify-between p-3 mb-2 rounded-lg border shadow-sm group touch-none relative ${
//         isPaid ? "bg-green-50 border-green-300" : ""
//       }`}
//     >
//       {isPaid && (
//         <div className="absolute top-1 right-1">
//           <CheckCircle2 className="w-4 h-4 text-green-600" />
//         </div>
//       )}

//       <div className="flex items-center gap-3 overflow-hidden flex-1">
//         <button
//           {...attributes}
//           {...listeners}
//           disabled={isPaid}
//           className={`p-1 ${
//             isPaid
//               ? "cursor-not-allowed text-muted-foreground/50"
//               : "cursor-grab hover:text-primary text-muted-foreground active:cursor-grabbing"
//           }`}
//         >
//           <GripVertical size={20} />
//         </button>

//         <div className="flex-1 min-w-0 flex flex-col justify-center">
//           <div className="flex items-center gap-2">
//             <Badge
//               variant="secondary"
//               className="h-5 px-1.5 text-[10px] shrink-0 font-bold"
//             >
//               {item.quantity}
//             </Badge>
//             <p className="font-medium text-sm truncate leading-tight">
//               {item.product.name}
//             </p>
//           </div>

//           {hasDetails && (
//             <div className="mt-1">
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <button
//                     className="cursor-pointer flex items-center gap-1 text-[12px] hover:underline focus:outline-none"
//                     onPointerDown={(e) => e.stopPropagation()}
//                   >
//                     <Info size={12} />
//                     Ver detalles / notas
//                   </button>
//                 </PopoverTrigger>
//                 <PopoverContent
//                   className="w-64 p-3 text-sm shadow-xl"
//                   side="right"
//                   align="start"
//                 >
//                   <div className="space-y-2">
//                     <h4 className="font-semibold border-b pb-1 text-xs text-muted-foreground uppercase">
//                       Detalles del Item
//                     </h4>
//                     {item.variantsDetail && (
//                       <div className="grid grid-cols-[16px_1fr] gap-1">
//                         <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
//                         <p className="text-xs">{item.variantsDetail}</p>
//                       </div>
//                     )}
//                     {item.notes && (
//                       <div className="grid grid-cols-[16px_1fr] gap-1 text-secondary">
//                         <p className="text-xs">
//                           <span className="font-bold text-primary">NOTA: </span>
//                           {item.notes}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Precio */}
//       <span className="font-bold text-sm font-mono shrink-0 ml-3 text-right">
//         S/ {(Number(item.price) * item.quantity).toFixed(2)}
//       </span>
//     </div>
//   );
// }

// function DroppableContainer({
//   id,
//   children,
// }: {
//   id: string;
//   children: React.ReactNode;
// }) {
//   const { setNodeRef } = useDroppable({ id });
//   return (
//     <ScrollArea className="h-56 w-full rounded-md pr-2">
//       <CardContent
//         ref={setNodeRef}
//         className="flex-1 p-2 mx-1 mb-1 flex flex-col border border-secondary rounded-lg"
//       >
//         {children}
//       </CardContent>
//       <ScrollBar orientation="vertical" />
//     </ScrollArea>
//   );
// }

// export default function SplitBillPage() {
//   const { id: tableId } = useParams();
//   const { data: order, isLoading, refetch } = useActiveOrder(tableId!);

//   const [columns, setColumns] = useState<{ [key: string]: any[] }>({});
//   const [columnOrder, setColumnOrder] = useState<string[]>([]);
//   const [activeId, setActiveId] = useState<string | null>(null);

//   const [paymentOpen, setPaymentOpen] = useState(false);
//   const [activePaymentGroup, setActivePaymentGroup] = useState<{
//     id: string;
//     total: number;
//     itemIds: string[];
//   } | null>(null);

//   // useEffect(() => {

//   //   if (!order) return;

//   //   setColumns((prev) => {
//   //     if (Object.keys(prev).length > 0) return prev;
//   //     return { "cuenta-principal": order.items };
//   //   });

//   //   setColumnOrder((prev) => {
//   //     if (prev.length > 0) return prev;
//   //     return ["cuenta-principal"];
//   //   });
//   // }, [order]);

//   useEffect(() => {
//     if (!order) return;

//     // Separar items pagados de no pagados
//     const unpaidItems = order.items.filter((item) => !item.saleId);
//     const paidItems = order.items.filter((item) => item.saleId);

//     setColumns((prev) => {
//       if (Object.keys(prev).length > 0) {
//         // Si ya hay columnas, actualizar solo los items no pagados
//         const updatedColumns = { ...prev };

//         // Remover items pagados de todas las columnas
//         Object.keys(updatedColumns).forEach((key) => {
//           updatedColumns[key] = updatedColumns[key].filter(
//             (item) => !paidItems.find((paid) => paid.id === item.id)
//           );
//         });

//         return updatedColumns;
//       }

//       // Primera vez: todos los items no pagados en cuenta principal
//       return { "cuenta-principal": unpaidItems };
//     });

//     setColumnOrder((prev) => {
//       if (prev.length > 0) return prev;
//       return ["cuenta-principal"];
//     });
//   }, [order]);

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
//     useSensor(KeyboardSensor)
//   );

//   const findContainer = (id: string) => {
//     if (id in columns) return id;
//     return Object.keys(columns).find((key) =>
//       columns[key].find((i: any) => i.id === id)
//     );
//   };

//   // const handleDragStart = (event: DragStartEvent) => {
//   //   setActiveId(event.active.id as string);
//   // };
//   const handleDragStart = (event: DragStartEvent) => {
//     const item = order?.items.find((i) => i.id === event.active.id);
//     if (item?.saleId) {
//       toast.error("Este item ya fue pagado y no se puede mover");
//       return;
//     }
//     setActiveId(event.active.id as string);
//   };

//   const handleDragOver = (event: DragOverEvent) => {
//     const { active, over } = event;
//     const overId = over?.id;

//     if (!overId || active.id === overId) return;

//     const activeContainer = findContainer(active.id as string);
//     const overContainer = findContainer(overId as string);

//     if (
//       !activeContainer ||
//       !overContainer ||
//       activeContainer === overContainer
//     ) {
//       return;
//     }

//     setColumns((prev) => {
//       const activeItems = prev[activeContainer];
//       const overItems = prev[overContainer];
//       const activeIndex = activeItems.findIndex((i) => i.id === active.id);
//       const overIndex = overItems.findIndex((i) => i.id === overId);

//       let newIndex;
//       if (overId in prev) {
//         newIndex = overItems.length + 1;
//       } else {
//         const isBelowOverItem =
//           over &&
//           active.rect.current.translated &&
//           active.rect.current.translated.top > over.rect.top + over.rect.height;

//         const modifier = isBelowOverItem ? 1 : 0;
//         newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
//       }

//       return {
//         ...prev,
//         [activeContainer]: [
//           ...prev[activeContainer].filter((item) => item.id !== active.id),
//         ],
//         [overContainer]: [
//           ...prev[overContainer].slice(0, newIndex),
//           activeItems[activeIndex],
//           ...prev[overContainer].slice(newIndex, prev[overContainer].length),
//         ],
//       };
//     });
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     const activeContainer = findContainer(active.id as string);
//     const overContainer = over ? findContainer(over.id as string) : null;

//     if (activeContainer && overContainer && activeContainer === overContainer) {
//       const activeIndex = columns[activeContainer].findIndex(
//         (i) => i.id === active.id
//       );
//       const overIndex = columns[overContainer].findIndex(
//         (i) => i.id === over?.id
//       );

//       if (activeIndex !== overIndex) {
//         setColumns((prev) => ({
//           ...prev,
//           [activeContainer]: arrayMove(
//             prev[activeContainer],
//             activeIndex,
//             overIndex
//           ),
//         }));
//       }
//     }

//     setActiveId(null);
//   };

//   const addAccount = () => {
//     const newId = `cuenta-${columnOrder.length + 1}`;
//     setColumns((prev) => ({ ...prev, [newId]: [] }));
//     setColumnOrder((prev) => [...prev, newId]);
//   };

//   const handlePayGroup = (columnId: string) => {
//     const items = columns[columnId];

//     const unpaidItems = items.filter((item) => !item.saleId);

//     // if (items.length === 0) {
//     //   toast.error("Esta cuenta está vacía");
//     //   return;
//     // }
//     if (unpaidItems.length === 0) {
//       toast.error("Todos los items de esta cuenta ya fueron pagados");
//       return;
//     }

//     const total = items.reduce(
//       (acc: number, item: any) => acc + Number(item.price) * item.quantity,
//       0
//     );
//     const itemIds = items.map((i: any) => i.id);
//     setActivePaymentGroup({ id: columnId, total, itemIds });
//     setPaymentOpen(true);
//   };

//   const handleClosePayment = () => {
//     setPaymentOpen(false);
//     // Recargar página o invalidar query para refrescar items
//     // navigate(0);
//     setActivePaymentGroup(null);
//     // ✅ Refrescar la orden para ver items pagados
//     refetch();
//   };

//   const dropAnimation: DropAnimation = {
//     sideEffects: defaultDropAnimationSideEffects({
//       styles: {
//         active: {
//           opacity: "0.5",
//         },
//       },
//     }),
//   };

//   if (isLoading) return <SpinnerLoading />;

//   const allItemsPaid = order?.items.every((item) => item.saleId !== null);

//   return (
//     <div>
//       <div className="pb-2 flex justify-between items-center">
//         <h1 className="font-bold text-lg">Dividir Cuenta</h1>
//         {allItemsPaid && (
//           <p className="text-sm text-green-600 font-medium">
//             ✅ Todos los items han sido pagados. Mesa libre.
//           </p>
//         )}
//         <div className="flex gap-2">
//           <Button onClick={addAccount} size="sm" className="gap-2 ">
//             <Plus />
//             <span className="hidden sm:inline">Nueva Cuenta</span>
//           </Button>
//         </div>
//       </div>

//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCorners}
//         onDragStart={handleDragStart}
//         onDragOver={handleDragOver}
//         onDragEnd={handleDragEnd}
//       >
//         <div className="w-full">
//           <ScrollArea>
//             <div className="min-w-full flex gap-2 pb-3 sm:max-w-sm">
//               {columnOrder.map((columnId) => {
//                 const items = columns[columnId];

//                 // const total = items.reduce(
//                 //   (acc: number, item: any) =>
//                 //     acc + Number(item.price) * item.quantity,
//                 //   0
//                 // );

//                 const unpaidItems = items.filter((item) => !item.saleId);
//                 const total = unpaidItems.reduce(
//                   (acc: number, item: any) =>
//                     acc + Number(item.price) * item.quantity,
//                   0
//                 );

//                 const Subtotal = (total / 1.18).toFixed(2);
//                 const totalIgv = (total - total / 1.18).toFixed(2);

//                 const paidCount = items.filter((item) => item.saleId).length;
//                 const allPaidInColumn =
//                   items.length > 0 && paidCount === items.length;

//                 return (
//                   <Card
//                     key={columnId}
//                     className={`w-[300px] sm:w-[350px] min-w-[300px] flex flex-col h-full max-h-[calc(100vh-220px)] ${
//                       allPaidInColumn ? "border-green-300 bg-green-50/30" : ""
//                     }`}
//                   >
//                     <CardHeader className="flex flex-row items-center justify-between shrink-0">
//                       <CardTitle className="text-base capitalize ">
//                         {columnId.replace("-", " ")}
//                       </CardTitle>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreVertical size={16} />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent>
//                           <DropdownMenuItem
//                             onClick={() => toast.info("Pre-cuenta parcial...")}
//                           >
//                             <Printer className="mr-2 h-4 w-4" /> Pre-cuenta
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </CardHeader>

//                     <div className="flex justify-between items-center px-6 text-xs text-muted-foreground font-medium shrink-0">
//                       <span>Productos</span>
//                       <span>
//                         {items.length} items
//                         {paidCount > 0 && ` (${paidCount} pagados)`}
//                       </span>
//                     </div>

//                     <SortableContext
//                       id={columnId}
//                       items={items.map((i: any) => i.id)}
//                       strategy={verticalListSortingStrategy}
//                     >
//                       <DroppableContainer id={columnId}>
//                         <div className="space-y-2 p-1 min-h-[50px]">
//                           {items.length === 0 ? (
//                             <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground text-xs">
//                               Arrastra productos aquí
//                             </div>
//                           ) : (
//                             items.map((item: any) => (
//                               <SortableItem
//                                 key={item.id}
//                                 id={item.id}
//                                 item={item}
//                                 isPaid={!!item.saleId}
//                               />
//                             ))
//                           )}
//                         </div>
//                       </DroppableContainer>
//                     </SortableContext>

//                     <CardFooter className="pt-4 border-t flex-col gap-3 pb-6 shrink-0">
//                       <div className="w-full space-y-2">
//                         <div className="flex justify-between items-center text-sm font-mono">
//                           <span>Sub Total</span>
//                           <span>S/ {Subtotal}</span>
//                         </div>

//                         <div className="flex justify-between items-center text-sm font-mono">
//                           <span>IGV (18%)</span>
//                           <span>S/ {totalIgv}</span>
//                         </div>

//                         {/* <div className="flex justify-between items-center text-sm font-mono">
//                           <span>Total</span>
//                           <span>S/ {total.toFixed(2)}</span>
//                         </div> */}
//                       </div>

//                       <Button
//                         className="w-full cursor-pointer"
//                         variant={total > 0 ? "default" : "secondary"}
//                         disabled={total === 0 || allPaidInColumn}
//                         onClick={() => handlePayGroup(columnId)}
//                       >
//                         {allPaidInColumn ? (
//                           <>
//                             <CheckCircle2 className="mr-2 w-4 h-4" />
//                             Cuenta Pagada
//                           </>
//                         ) : (
//                           <>
//                             Pagar
//                             <span>S/ {total.toFixed(2)}</span>
//                           </>
//                         )}
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 );
//               })}
//             </div>
//             <ScrollBar orientation="horizontal" />
//           </ScrollArea>
//         </div>
//         <DragOverlay dropAnimation={dropAnimation}>
//           {activeId ? (
//             <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-2xl border w-[300px] opacity-90 cursor-grabbing">
//               <div className="flex items-center gap-3">
//                 <GripVertical size={18} />
//                 <p className="font-bold">Moviendo item...</p>
//               </div>
//             </div>
//           ) : null}
//         </DragOverlay>
//       </DndContext>

//       {paymentOpen && activePaymentGroup && order && (
//         <PaymentModal
//           open={paymentOpen}
//           onClose={handleClosePayment}
//           orderId={order.id}
//           totalAmount={activePaymentGroup.total}
//           itemIds={activePaymentGroup.itemIds}
//         />
//       )}
//     </div>
//   );
// }

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
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Plus,
  GripVertical,
  MoreVertical,
  Printer,
  Info,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentModal } from "../components/PaymentModal";
import SpinnerLoading from "@/components/SpinnerLoading";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function SortableItem({
  id,
  item,
  isPaid,
}: {
  id: string;
  item: any;
  isPaid: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: isPaid, // ✅ Deshabilitar drag si ya está pagado
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isPaid ? 0.6 : 1, // ✅ Opacidad reducida si está pagado
  };

  const hasDetails = item.notes || item.variantsDetail;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 mb-2 rounded-lg border shadow-sm group touch-none relative ${
        isPaid ? "bg-green-50 border-green-300" : ""
      }`}
    >
      {/* ✅ Indicador de pagado */}
      {isPaid && (
        <div className="absolute top-1 right-1">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        </div>
      )}

      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <button
          {...attributes}
          {...listeners}
          disabled={isPaid}
          className={`p-1 ${
            isPaid
              ? "cursor-not-allowed text-muted-foreground/50"
              : "cursor-grab hover:text-primary text-muted-foreground active:cursor-grabbing"
          }`}
        >
          <GripVertical size={20} />
        </button>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <Badge
              variant={isPaid ? "outline" : "secondary"}
              className="h-5 px-1.5 text-[10px] shrink-0 font-bold"
            >
              {item.quantity}
            </Badge>
            <p
              className={`font-medium text-sm truncate leading-tight ${
                isPaid ? "line-through text-muted-foreground" : ""
              }`}
            >
              {item.product.name}
            </p>
            {isPaid && (
              <Badge variant="outline" className="text-[10px] bg-green-50">
                PAGADO
              </Badge>
            )}
          </div>

          {hasDetails && (
            <div className="mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="cursor-pointer flex items-center gap-1 text-[12px] hover:underline focus:outline-none"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <Info size={12} />
                    Ver detalles / notas
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64 p-3 text-sm shadow-xl"
                  side="right"
                  align="start"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold border-b pb-1 text-xs text-muted-foreground uppercase">
                      Detalles del Item
                    </h4>
                    {item.variantsDetail && (
                      <div className="grid grid-cols-[16px_1fr] gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                        <p className="text-xs">{item.variantsDetail}</p>
                      </div>
                    )}
                    {item.notes && (
                      <div className="grid grid-cols-[16px_1fr] gap-1 text-secondary">
                        <p className="text-xs">
                          <span className="font-bold text-primary">NOTA: </span>
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      {/* Precio */}
      <span
        className={`font-bold text-sm font-mono shrink-0 ml-3 text-right ${
          isPaid ? "text-muted-foreground" : ""
        }`}
      >
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
    <ScrollArea className="h-56 w-full rounded-md pr-2">
      <CardContent
        ref={setNodeRef}
        className="flex-1 p-2 mx-1 mb-1 flex flex-col border border-secondary rounded-lg"
      >
        {children}
      </CardContent>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}

export default function SplitBillPage() {
  const { id: tableId } = useParams();
  const { data: order, isLoading, refetch } = useActiveOrder(tableId!);

  const [columns, setColumns] = useState<{ [key: string]: any[] }>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [activePaymentGroup, setActivePaymentGroup] = useState<{
    id: string;
    total: number;
    itemIds: string[];
  } | null>(null);

  // ✅ Actualizar columnas cuando cambie la orden (después de pagar)
  useEffect(() => {
    if (!order) return;

    // Separar items pagados de no pagados
    const unpaidItems = order.items.filter((item) => !item.saleId);
    const paidItems = order.items.filter((item) => item.saleId);

    setColumns((prev) => {
      if (Object.keys(prev).length > 0) {
        // Si ya hay columnas, actualizar solo los items no pagados
        const updatedColumns = { ...prev };

        // Remover items pagados de todas las columnas
        Object.keys(updatedColumns).forEach((key) => {
          updatedColumns[key] = updatedColumns[key].filter(
            (item) => !paidItems.find((paid) => paid.id === item.id)
          );
        });

        return updatedColumns;
      }

      // Primera vez: todos los items no pagados en cuenta principal
      return { "cuenta-principal": unpaidItems };
    });

    setColumnOrder((prev) => {
      if (prev.length > 0) return prev;
      return ["cuenta-principal"];
    });
  }, [order]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const findContainer = (id: string) => {
    if (id in columns) return id;
    return Object.keys(columns).find((key) =>
      columns[key].find((i: any) => i.id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const item = order?.items.find((i) => i.id === event.active.id);
    if (item?.saleId) {
      toast.error("Este item ya fue pagado y no se puede mover");
      return;
    }
    setActiveId(event.active.id as string);
  };

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
        newIndex = overItems.length + 1;
      } else {
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

  const addAccount = () => {
    const newId = `cuenta-${columnOrder.length + 1}`;
    setColumns((prev) => ({ ...prev, [newId]: [] }));
    setColumnOrder((prev) => [...prev, newId]);
  };

  const handlePayGroup = (columnId: string) => {
    const items = columns[columnId];

    // ✅ Filtrar solo items no pagados
    const unpaidItems = items.filter((item) => !item.saleId);

    if (unpaidItems.length === 0) {
      toast.error("Todos los items de esta cuenta ya fueron pagados");
      return;
    }

    const total = unpaidItems.reduce(
      (acc: number, item: any) => acc + Number(item.price) * item.quantity,
      0
    );
    const itemIds = unpaidItems.map((i: any) => i.id);
    setActivePaymentGroup({ id: columnId, total, itemIds });
    setPaymentOpen(true);
  };

  const handleClosePayment = () => {
    setPaymentOpen(false);
    setActivePaymentGroup(null);
    // ✅ Refrescar la orden para ver items pagados
    refetch();
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

  // ✅ Verificar si todos los items están pagados
  const allItemsPaid = order?.items.every((item) => item.saleId !== null);

  return (
    <div>
      <div className="pb-2 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">Dividir Cuenta</h1>
          {allItemsPaid && (
            <p className="text-sm text-green-600 font-medium">
              ✅ Todos los items han sido pagados. Mesa libre.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={addAccount}
            size="sm"
            className="gap-2"
            disabled={allItemsPaid}
          >
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
        <div className="w-full">
          <ScrollArea>
            <div className="min-w-full flex gap-2 pb-3 sm:max-w-sm">
              {columnOrder.map((columnId) => {
                const items = columns[columnId];

                // ✅ Calcular total solo de items no pagados
                const unpaidItems = items.filter((item) => !item.saleId);
                const total = unpaidItems.reduce(
                  (acc: number, item: any) =>
                    acc + Number(item.price) * item.quantity,
                  0
                );

                const Subtotal = (total / 1.18).toFixed(2);
                const totalIgv = (total - total / 1.18).toFixed(2);

                const paidCount = items.filter((item) => item.saleId).length;
                const allPaidInColumn =
                  items.length > 0 && paidCount === items.length;

                return (
                  <Card
                    key={columnId}
                    className={`w-[300px] sm:w-[350px] min-w-[300px] flex flex-col h-full max-h-[calc(100vh-220px)] ${
                      allPaidInColumn ? "border-green-300 bg-green-50/30" : ""
                    }`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between shrink-0">
                      <CardTitle className="text-base capitalize flex items-center gap-2">
                        {columnId.replace("-", " ")}
                        {allPaidInColumn && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-700 text-[10px]"
                          >
                            PAGADA
                          </Badge>
                        )}
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
                      <span>
                        {items.length} items
                        {paidCount > 0 && ` (${paidCount} pagados)`}
                      </span>
                    </div>

                    <SortableContext
                      id={columnId}
                      items={items.map((i: any) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <DroppableContainer id={columnId}>
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
                                isPaid={!!item.saleId}
                              />
                            ))
                          )}
                        </div>
                      </DroppableContainer>
                    </SortableContext>

                    <CardFooter className="pt-4 border-t flex-col gap-3 pb-6 shrink-0">
                      <div className="w-full space-y-2">
                        <div className="flex justify-between items-center text-sm font-mono">
                          <span>Sub Total</span>
                          <span>S/ {Subtotal}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm font-mono">
                          <span>IGV (18%)</span>
                          <span>S/ {totalIgv}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full cursor-pointer"
                        variant={total > 0 ? "default" : "secondary"}
                        disabled={total === 0 || allPaidInColumn}
                        onClick={() => handlePayGroup(columnId)}
                      >
                        {allPaidInColumn ? (
                          <>
                            <CheckCircle2 className="mr-2 w-4 h-4" />
                            Cuenta Pagada
                          </>
                        ) : (
                          <>
                            Pagar
                            <span>S/ {total.toFixed(2)}</span>
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-2xl border w-[300px] opacity-90 cursor-grabbing">
              <div className="flex items-center gap-3">
                <GripVertical size={18} />
                <p className="font-bold">Moviendo item...</p>
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
          allItemsPaid={allItemsPaid} // ✅ Pasar estado de todos pagados
        />
      )}
    </div>
  );
}
