// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Printer } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// // import { usePrinters } from "../hook/usePrinters";
// import { PrinterSelectionModal } from "./Printerselectionmodal";

// interface PrintButtonsProps {
//   orderId: string;
//   orderNumber: string | number;
// }

// export function PrintButtons({ orderId, orderNumber }: PrintButtonsProps) {
//   // const { printers, loading, isServiceConnected, reprintComanda } =
//   //   usePrinters();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [printType, setPrintType] = useState<"cocina" | "bebidas" | "todas">(
//     "todas"
//   );

//   const handleOpenModal = (type: "cocina" | "bebidas" | "todas") => {
//     setPrintType(type);
//     setModalOpen(true);
//   };

//   const handlePrint = async (printerName: string) => {
//     // Si selecciona una impresora específica, usar ese printer
//     // Si selecciona "todas", imprimir en todas
//     let printer: "cocina" | "bebidas" | "todas" = "todas";

//     if (printerName === "cocina") {
//       printer = "cocina";
//     } else if (printerName === "bebidas") {
//       printer = "bebidas";
//     } else if (printType !== "todas") {
//       printer = printType;
//     }

//     await reprintComanda(orderId, printer);
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       {/* Estado del servicio */}
//       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//         <div
//           className={`h-2 w-2 rounded-full ${
//             isServiceConnected ? "bg-green-500" : "bg-red-500"
//           }`}
//         />
//         <span>
//           {isServiceConnected
//             ? "Servicio de impresión conectado"
//             : "Servicio de impresión desconectado"}
//         </span>
//       </div>

//       {/* Botones de impresión */}
//       <div className="flex flex-wrap gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handleOpenModal("cocina")}
//           disabled={loading || !isServiceConnected}
//         >
//           <Printer className="mr-2 h-4 w-4" />
//           Reimprimir Cocina
//           <Badge variant="secondary" className="ml-2">
//             🍽️
//           </Badge>
//         </Button>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handleOpenModal("bebidas")}
//           disabled={loading || !isServiceConnected}
//         >
//           <Printer className="mr-2 h-4 w-4" />
//           Reimprimir Bebidas
//           <Badge variant="secondary" className="ml-2">
//             🍹
//           </Badge>
//         </Button>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handleOpenModal("todas")}
//           disabled={loading || !isServiceConnected}
//         >
//           <Printer className="mr-2 h-4 w-4" />
//           Reimprimir Todo
//         </Button>
//       </div>

//       {/* Modal de selección */}
//       <PrinterSelectionModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onPrint={handlePrint}
//         title={`Reimprimir Comanda #${orderNumber}`}
//         description={
//           printType === "cocina"
//             ? "Selecciona la impresora de cocina"
//             : printType === "bebidas"
//             ? "Selecciona la impresora de bebidas"
//             : "Selecciona dónde reimprimir"
//         }
//         printers={
//           printType === "cocina"
//             ? { cocina: printers.cocina }
//             : printType === "bebidas"
//             ? { bebidas: printers.bebidas }
//             : printers
//         }
//         defaultPrinter={printType !== "todas" ? printType : undefined}
//       />
//     </div>
//   );
// }
