// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Font,
// } from "@react-pdf/renderer";
// import type { Order } from "../types/order.types";

// // Registrar fuente monoespaciada
// Font.register({
//   family: "Courier",
//   src: "https://fonts.gstatic.com/s/courierprime/v7/u-450q2lgwslOqpF_6gQ8kELWwZjW-_-tvg.ttf",
// });

// // Estilos para el PDF
// const styles = StyleSheet.create({
//   page: {
//     padding: 20,
//     backgroundColor: "#ffffff",
//     fontFamily: "Courier",
//   },
//   container: {
//     maxWidth: 280,
//     margin: "0 auto",
//   },
//   // Header
//   header: {
//     textAlign: "center",
//     borderBottomWidth: 2,
//     borderBottomColor: "#000",
//     borderBottomStyle: "solid",
//     paddingBottom: 8,
//     marginBottom: 8,
//   },
//   businessName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   floorName: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   businessInfo: {
//     fontSize: 8,
//     color: "#666",
//     marginTop: 2,
//   },
//   // Tipo de documento
//   documentType: {
//     textAlign: "center",
//     marginVertical: 8,
//   },
//   documentTypeTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     border: "2px solid #000",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     marginBottom: 4,
//   },
//   documentTypeSubtitle: {
//     fontSize: 7,
//     color: "#666",
//   },
//   // Info de orden
//   orderInfo: {
//     fontSize: 9,
//     marginVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#999",
//     paddingBottom: 6,
//   },
//   orderInfoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 2,
//   },
//   orderInfoLabel: {
//     color: "#666",
//   },
//   orderInfoValue: {
//     fontWeight: "bold",
//   },
//   // Items header
//   itemsHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     fontSize: 8,
//     fontWeight: "bold",
//     borderBottomWidth: 1,
//     borderBottomColor: "#999",
//     paddingBottom: 2,
//     marginBottom: 6,
//   },
//   // Items
//   item: {
//     marginBottom: 8,
//     fontSize: 8,
//   },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 2,
//   },
//   itemQuantity: {
//     fontWeight: "bold",
//     color: "#22c55e",
//     width: 30,
//   },
//   itemName: {
//     flex: 1,
//     fontWeight: "bold",
//   },
//   itemTotal: {
//     fontWeight: "bold",
//     textAlign: "right",
//     width: 60,
//   },
//   itemUnit: {
//     fontSize: 7,
//     color: "#666",
//     marginLeft: 30,
//   },
//   itemVariants: {
//     fontSize: 7,
//     color: "#3b82f6",
//     marginLeft: 30,
//     marginTop: 1,
//   },
//   itemNotes: {
//     fontSize: 7,
//     color: "#f59e0b",
//     fontStyle: "italic",
//     marginLeft: 30,
//     marginTop: 1,
//   },
//   // Divider
//   divider: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#999",
//     marginVertical: 6,
//   },
//   dividerBold: {
//     borderBottomWidth: 2,
//     borderBottomColor: "#000",
//     marginVertical: 8,
//   },
//   // Totales
//   totals: {
//     fontSize: 9,
//     marginTop: 6,
//   },
//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },
//   totalLabel: {
//     color: "#666",
//   },
//   totalValue: {
//     fontFamily: "Courier",
//   },
//   totalFinal: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 4,
//   },
//   // Footer
//   footer: {
//     marginTop: 12,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: "#999",
//     textAlign: "center",
//   },
//   footerBold: {
//     fontSize: 9,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   footerText: {
//     fontSize: 7,
//     color: "#666",
//     marginBottom: 2,
//   },
//   footerThanks: {
//     fontSize: 8,
//     marginTop: 8,
//     paddingTop: 6,
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//   },
// });

// interface PreCuentaPDFProps {
//   order: Order;
// }

// export const PreCuentaPDF = ({ order }: PreCuentaPDFProps) => {
//   // ✅ Validar que order existe
//   if (!order || !order.items) {
//     return (
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <View style={styles.container}>
//             <Text>Error: No se pudo cargar la información de la orden</Text>
//           </View>
//         </Page>
//       </Document>
//     );
//   }

//   // Cálculos
//   const totalAmount = order.items.reduce((acc, item) => {
//     return acc + Number(item.price) * item.quantity;
//   }, 0);

//   const subtotal = totalAmount / 1.18;
//   const igv = totalAmount - subtotal;

//   // ✅ Obtener nombre del piso de forma segura
//   const floorName = order.table?.floor?.name || "PISO 1";
//   const tableName = order.table?.name || `Mesa ${order.table?.number || ""}`;
//   const waiterName = order.user?.name || "Mozo";

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.container}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.businessName}>ICE MANKORA</Text>
//             <Text style={styles.floorName}>{floorName}</Text>
//             <Text style={styles.businessInfo}>Jr. Principal 123, Máncora</Text>
//             <Text style={styles.businessInfo}>RUC: 20123456789</Text>
//           </View>

//           {/* Tipo de documento */}
//           <View style={styles.documentType}>
//             <Text style={styles.documentTypeTitle}>PRE-CUENTA</Text>
//             <Text style={styles.documentTypeSubtitle}>TICKET INTERNO</Text>
//           </View>

//           {/* Info de la orden */}
//           <View style={styles.orderInfo}>
//             <View style={styles.orderInfoRow}>
//               <Text style={styles.orderInfoLabel}>Orden:</Text>
//               <Text style={styles.orderInfoValue}>#{order.dailyNumber}</Text>
//             </View>
//             <View style={styles.orderInfoRow}>
//               <Text style={styles.orderInfoLabel}>Mesa:</Text>
//               <Text style={styles.orderInfoValue}>{tableName}</Text>
//             </View>
//             <View style={styles.orderInfoRow}>
//               <Text style={styles.orderInfoLabel}>Mozo:</Text>
//               <Text style={styles.orderInfoValue}>{waiterName}</Text>
//             </View>
//             <View style={styles.orderInfoRow}>
//               <Text style={styles.orderInfoLabel}>Fecha:</Text>
//               <Text style={styles.orderInfoValue}>
//                 {new Date().toLocaleString("es-PE")}
//               </Text>
//             </View>
//           </View>

//           {/* Items Header */}
//           <View style={styles.itemsHeader}>
//             <Text style={{ width: 30 }}>CANT</Text>
//             <Text style={{ flex: 1 }}>PRODUCTO</Text>
//             <Text style={{ width: 60, textAlign: "right" }}>TOTAL</Text>
//           </View>

//           {/* Items */}
//           {order.items.map((item, index) => (
//             <View key={index} style={styles.item}>
//               <View style={styles.itemRow}>
//                 <Text style={styles.itemQuantity}>{item.quantity}x</Text>
//                 <Text style={styles.itemName}>
//                   {item.product?.name || "Producto"}
//                 </Text>
//                 <Text style={styles.itemTotal}>
//                   S/ {(Number(item.price) * item.quantity).toFixed(2)}
//                 </Text>
//               </View>

//               {item.quantity > 1 && (
//                 <Text style={styles.itemUnit}>
//                   S/ {Number(item.price).toFixed(2)} c/u
//                 </Text>
//               )}

//               {item.variantsDetail && (
//                 <Text style={styles.itemVariants}>{item.variantsDetail}</Text>
//               )}

//               {item.notes && (
//                 <Text style={styles.itemNotes}>⚠️ {item.notes}</Text>
//               )}
//             </View>
//           ))}

//           {/* Divider */}
//           <View style={styles.dividerBold} />

//           {/* Totales */}
//           <View style={styles.totals}>
//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>Subtotal:</Text>
//               <Text style={styles.totalValue}>S/ {subtotal.toFixed(2)}</Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>IGV (18%):</Text>
//               <Text style={styles.totalValue}>S/ {igv.toFixed(2)}</Text>
//             </View>
//             <View style={styles.dividerBold} />
//             <View style={[styles.totalRow, styles.totalFinal]}>
//               <Text>TOTAL:</Text>
//               <Text>S/ {totalAmount.toFixed(2)}</Text>
//             </View>
//           </View>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerBold}>PRESENTE ESTE TICKET EN CAJA</Text>
//             <Text style={styles.footerText}>
//               Para solicitar su comprobante oficial
//             </Text>
//             <Text style={styles.footerThanks}>
//               ¡Gracias por su preferencia!
//             </Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// };

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Order } from "../types/order.types";

// Registrar fuente monoespaciada para tickets térmicos
Font.register({
  family: "Courier",
  src: "https://fonts.gstatic.com/s/courierprime/v7/u-450q2lgwslOqpF_6gQ8kELWwZjW-_-tvg.ttf",
});

// ✅ Estilos optimizados para ticket térmico de 80mm
const styles = StyleSheet.create({
  page: {
    width: "80mm", // ✅ Ancho del papel térmico
    padding: "4mm", // ✅ Margen pequeño
    backgroundColor: "#ffffff",
    fontFamily: "Courier",
    fontSize: 9, // ✅ Tamaño base para tickets
  },
  // Header
  header: {
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "dashed",
    paddingBottom: 4,
    marginBottom: 6,
  },
  businessName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  floorName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
  },
  businessInfo: {
    fontSize: 9,
    color: "#000",
    marginTop: 1,
  },
  // Tipo de documento
  documentType: {
    textAlign: "center",
    marginVertical: 4,
  },
  documentTypeTitle: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 2,
  },
  documentTypeSubtitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#000",
  },
  // Info de orden (compacta)
  orderInfo: {
    fontSize: 8,
    marginVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "dashed",
    paddingBottom: 4,
  },
  orderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  orderInfoLabel: {
    color: "#000",
    fontWeight: "bold",
  },
  orderInfoValue: {
    fontWeight: "bold",
  },
  // Items header (compacto)
  itemsHeader: {
    flexDirection: "row",
    fontSize: 7,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
    marginBottom: 3,
  },
  // Items (optimizado para 72mm)
  item: {
    marginBottom: 4,
    fontSize: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  itemQuantity: {
    fontWeight: "bold",
    width: "15%",
  },
  itemName: {
    flex: 1,
    paddingRight: 2,
    color: "#000",
    fontWeight: "bold",
  },
  itemTotal: {
    fontWeight: "bold",
    textAlign: "right",
    width: "25%",
  },
  itemDetails: {
    fontSize: 7,
    color: "#000",
    marginLeft: "15%",
    marginTop: 1,
    fontWeight: "bold",
  },
  itemNotes: {
    fontSize: 7,
    color: "#000",
    fontStyle: "italic",
    fontWeight: "bold",
    marginLeft: "15%",
    marginTop: 1,
  },
  // Dividers (líneas punteadas como ticket real)
  dividerDashed: {
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    borderBottomStyle: "dashed",
    marginVertical: 4,
  },
  dividerSolid: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 4,
  },
  // Totales (destacados)
  totals: {
    fontSize: 9,
    marginTop: 4,
    color: "#000",
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  totalLabel: {
    color: "#000",
    // fontWeight: "bold",
  },
  totalValue: {
    fontWeight: "bold",
  },
  totalFinal: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  // Footer (compacto)
  footer: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#999",
    borderTopStyle: "dashed",
    textAlign: "center",
  },
  footerBold: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 3,
  },
  footerText: {
    fontSize: 7,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 1,
  },
  footerThanks: {
    fontSize: 8,
    marginTop: 6,
    color: "#000",
    fontWeight: "bold",
  },
});

interface PreCuentaPDFProps {
  order: Order;
}

export const PreCuentaPDF = ({ order }: PreCuentaPDFProps) => {
  // Validar que order existe
  if (!order || !order.items) {
    return (
      <Document>
        <Page size={{ width: 227, height: 500 }} style={styles.page}>
          <View>
            <Text>Error: No se pudo cargar la orden</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // Cálculos
  const totalAmount = order.items.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);

  const subtotal = totalAmount / 1.18;
  const igv = totalAmount - subtotal;

  // Datos seguros
  const floorName = order.table?.floor?.name || "PISO 1";
  const tableName = order.table?.name || `Mesa ${order.table?.number || ""}`;
  const waiterName = order.user?.name || "Mozo";

  // ✅ Altura dinámica basada en cantidad de items
  const estimatedHeight = 350 + order.items.length * 35;

  return (
    <Document>
      <Page
        size={{ width: 227, height: estimatedHeight }} // ✅ 80mm = 227 puntos (aprox)
        style={styles.page}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.businessName}>ICE MANKORA</Text>
          <Text style={styles.floorName}>{floorName}</Text>
          <Text style={styles.businessInfo}>
            Jr. Ramón Castilla con Juan Antonio Trelles 2do Piso
          </Text>
          <Text style={styles.businessInfo}>RUC: 20615167755</Text>
        </View>

        {/* Tipo de documento */}
        <View style={styles.documentType}>
          <Text style={styles.documentTypeTitle}>PRE-CUENTA</Text>
          {/* <Text style={styles.documentTypeSubtitle}>TICKET INTERNO</Text> */}
        </View>

        {/* Info de la orden */}
        <View style={styles.orderInfo}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Orden:</Text>
            <Text style={styles.orderInfoValue}>#{order.dailyNumber}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Mesa:</Text>
            <Text style={styles.orderInfoValue}>{tableName}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Mozo:</Text>
            <Text style={styles.orderInfoValue}>{waiterName}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Fecha:</Text>
            <Text style={styles.orderInfoValue}>
              {new Date().toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              {new Date().toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        {/* Items Header */}
        <View style={styles.itemsHeader}>
          <Text style={{ width: "15%" }}>CANT</Text>
          <Text style={{ flex: 1 }}>DESCRIPCION</Text>
          <Text style={{ width: "25%", textAlign: "right" }}>IMPORTE</Text>
        </View>

        {/* Items */}
        {order.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemRow}>
              <Text style={styles.itemQuantity}>{item.quantity}</Text>
              <Text style={styles.itemName}>
                {item.product?.name || "Producto"}
              </Text>
              <Text style={styles.itemTotal}>
                {(Number(item.price) * item.quantity).toFixed(2)}
              </Text>
            </View>

            {/* Precio unitario si cantidad > 1 */}
            {item.quantity > 1 && (
              <Text style={styles.itemDetails}>
                @ {Number(item.price).toFixed(2)} c/u
              </Text>
            )}

            {/* Variantes */}
            {item.variantsDetail && (
              <Text style={styles.itemDetails}>+ {item.variantsDetail}</Text>
            )}

            {/* Notas */}
            {/* {item.notes && (
              <Text style={styles.itemNotes}>Nota: {item.notes}</Text>
            )} */}
          </View>
        ))}

        {/* Divider antes de totales */}
        <View style={styles.dividerSolid} />

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SUBTOTAL:</Text>
            <Text style={styles.totalValue}>S/ {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IGV (18%):</Text>
            <Text style={styles.totalValue}>S/ {igv.toFixed(2)}</Text>
          </View>
          <View style={styles.totalFinal}>
            <View style={styles.totalRow}>
              <Text>TOTAL:</Text>
              <Text>S/ {totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBold}>¡Gracias por su preferencia!</Text>
          {/* <Text style={styles.footerText}>
            Para solicitar su comprobante oficial
          </Text> */}
          <Text style={styles.footerThanks}>VUELVA PRONTO</Text>
        </View>
      </Page>
    </Document>
  );
};
