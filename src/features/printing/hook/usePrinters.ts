// import axiosInstance from "@/lib/axios";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";

// interface PrinterInfo {
//   name: string;
//   type: "local" | "network";
//   printer_name?: string;
//   ip?: string;
//   port?: number;
// }

// interface PrintersConfig {
//   [key: string]: PrinterInfo;
// }

// export function usePrinters() {
//   const [printers, setPrinters] = useState<PrintersConfig>({});
//   const [loading, setLoading] = useState(true);
//   const [isServiceConnected, setIsServiceConnected] = useState(false);

//   useEffect(() => {
//     fetchPrinterStatus();
//     fetchPrintersConfig();
//   }, []);

//   const fetchPrinterStatus = async () => {
//     try {
//       const response = await axiosInstance.get("/orders/printer/status");
//       setIsServiceConnected(response.data.isConnected);

//       if (!response.data.isConnected) {
//         toast.warning("Servicio de impresión no disponible", {
//           description: "Verifica que el Print Service esté ejecutándose",
//         });
//       }
//     } catch (error) {
//       console.error("Error verificando servicio:", error);
//       setIsServiceConnected(false);
//     }
//   };

//   const fetchPrintersConfig = async () => {
//     try {
//       setLoading(true);

//       // Solicitar al backend que obtenga la configuración del Print Service
//       await axiosInstance.get("/orders/printer/config");

//       // TODO: El backend debería devolver la configuración
//       // Por ahora, configuración estática de ejemplo
//       setPrinters({
//         caja: {
//           name: "caja",
//           type: "local",
//           printer_name: "caja-printer",
//         },
//         cocina: {
//           name: "cocina",
//           type: "network",
//           ip: "192.168.18.100",
//           port: 9100,
//         },
//         bebidas: {
//           name: "bebidas",
//           type: "network",
//           ip: "192.168.18.101",
//           port: 9100,
//         },
//       });
//     } catch (error) {
//       console.error("Error obteniendo configuración:", error);
//       toast.error("Error al obtener configuración de impresoras");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reprintComanda = async (
//     orderId: string,
//     printer: "cocina" | "bebidas" | "todas"
//   ) => {
//     try {
//       const response = await axiosInstance.post(
//         `/orders/${orderId}/reprint-comanda?printer=${printer}`
//       );

//       toast.success("Comanda impresa", {
//         description: response.data.message,
//       });

//       return response.data;
//     } catch (error: any) {
//       toast.error("Error al imprimir", {
//         description: error.response?.data?.message || "Error desconocido",
//       });
//       throw error;
//     }
//   };

//   return {
//     printers,
//     loading,
//     isServiceConnected,
//     reprintComanda,
//     refetch: fetchPrintersConfig,
//   };
// }
