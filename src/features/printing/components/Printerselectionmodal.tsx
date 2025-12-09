// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Printer, Check, Loader2, AlertCircle } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// interface PrinterInfo {
//   name: string;
//   type: "local" | "network";
//   printer_name?: string;
//   ip?: string;
//   port?: number;
//   status?: "connected" | "disconnected";
// }

// interface PrinterSelectionModalProps {
//   open: boolean;
//   onClose: () => void;
//   onPrint: (printerName: string) => Promise<void>;
//   title: string;
//   description: string;
//   printers: Record<string, PrinterInfo>;
//   defaultPrinter?: string;
// }

// export function PrinterSelectionModal({
//   open,
//   onClose,
//   onPrint,
//   title,
//   description,
//   printers,
//   defaultPrinter,
// }: PrinterSelectionModalProps) {
//   const [selectedPrinter, setSelectedPrinter] = useState<string>(
//     defaultPrinter || Object.keys(printers)[0] || ""
//   );
//   const [printing, setPrinting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handlePrint = async () => {
//     if (!selectedPrinter) {
//       setError("Selecciona una impresora");
//       return;
//     }

//     setPrinting(true);
//     setError(null);

//     try {
//       await onPrint(selectedPrinter);
//       onClose();
//     } catch (err: any) {
//       setError(err.message || "Error al imprimir");
//     } finally {
//       setPrinting(false);
//     }
//   };

//   const getPrinterIcon = (type: "local" | "network") => {
//     return type === "local" ? "🖨️" : "🌐";
//   };

//   const getPrinterDetails = (printer: PrinterInfo) => {
//     if (printer.type === "local") {
//       return printer.printer_name || "Impresora USB";
//     } else {
//       return `${printer.ip}:${printer.port || 9100}`;
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Printer className="h-5 w-5" />
//             {title}
//           </DialogTitle>
//           <DialogDescription>{description}</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           {Object.keys(printers).length === 0 ? (
//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>
//                 No hay impresoras configuradas. Configura las impresoras en el
//                 servicio de impresión.
//               </AlertDescription>
//             </Alert>
//           ) : (
//             <RadioGroup
//               value={selectedPrinter}
//               onValueChange={setSelectedPrinter}
//             >
//               {Object.entries(printers).map(([name, printer]) => (
//                 <div
//                   key={name}
//                   className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent cursor-pointer"
//                   onClick={() => setSelectedPrinter(name)}
//                 >
//                   <RadioGroupItem value={name} id={name} />
//                   <Label
//                     htmlFor={name}
//                     className="flex-1 cursor-pointer space-y-1"
//                   >
//                     <div className="flex items-center gap-2">
//                       <span className="text-lg">
//                         {getPrinterIcon(printer.type)}
//                       </span>
//                       <span className="font-medium capitalize">{name}</span>
//                       <Badge variant="outline" className="ml-auto">
//                         {printer.type === "local" ? "USB" : "Red"}
//                       </Badge>
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       {getPrinterDetails(printer)}
//                     </div>
//                   </Label>
//                   {selectedPrinter === name && (
//                     <Check className="h-4 w-4 text-primary" />
//                   )}
//                 </div>
//               ))}
//             </RadioGroup>
//           )}

//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={onClose} disabled={printing}>
//             Cancelar
//           </Button>
//           <Button onClick={handlePrint} disabled={printing || !selectedPrinter}>
//             {printing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Imprimiendo...
//               </>
//             ) : (
//               <>
//                 <Printer className="mr-2 h-4 w-4" />
//                 Imprimir
//               </>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
