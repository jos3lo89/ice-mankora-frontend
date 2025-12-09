// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Font,
// } from "@react-pdf/renderer";
// import type { PrintData } from "../../types/billing.types";

// // Registrar fuente monoespaciada
// Font.register({
//   family: "Courier",
//   src: "https://fonts.gstatic.com/s/courierprime/v7/u-450q2lgwslOqpF_6gQ8kELWwZjW-_-tvg.ttf",
// });

// const styles = StyleSheet.create({
//   page: {
//     width: "80mm",
//     padding: "4mm",
//     backgroundColor: "#ffffff",
//     fontFamily: "Courier",
//     fontSize: 8,
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: 6,
//   },
//   businessName: {
//     fontSize: 12,
//     fontWeight: "bold",
//     marginBottom: 2,
//   },
//   businessInfo: {
//     fontSize: 7,
//     color: "#333",
//     marginBottom: 1,
//   },
//   divider: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#999",
//     borderBottomStyle: "dashed",
//     marginVertical: 4,
//   },
//   dividerSolid: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#000",
//     marginVertical: 4,
//   },
//   docTitle: {
//     fontSize: 11,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 4,
//   },
//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 2,
//     fontSize: 7,
//   },
//   label: {
//     color: "#666",
//   },
//   value: {
//     fontWeight: "bold",
//   },
//   itemsHeader: {
//     flexDirection: "row",
//     fontSize: 7,
//     fontWeight: "bold",
//     marginBottom: 3,
//     paddingBottom: 2,
//     borderBottomWidth: 1,
//     borderBottomColor: "#999",
//   },
//   item: {
//     marginBottom: 3,
//     fontSize: 8,
//   },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   totals: {
//     marginTop: 4,
//   },
//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 2,
//     fontSize: 8,
//   },
//   totalFinal: {
//     fontSize: 11,
//     fontWeight: "bold",
//     marginTop: 4,
//     paddingTop: 4,
//     borderTopWidth: 2,
//     borderTopColor: "#000",
//   },
//   footer: {
//     marginTop: 8,
//     textAlign: "center",
//     fontSize: 7,
//   },
//   footerBold: {
//     fontWeight: "bold",
//     marginBottom: 2,
//   },
// });

// interface Props {
//   data: PrintData;
// }

// export const TicketConsumoPDF = ({ data }: Props) => {
//   if (!data) return null;

//   const estimatedHeight = 400 + (data.items?.length || 0) * 30;

//   return (
//     <Document>
//       <Page size={{ width: 227, height: estimatedHeight }} style={styles.page}>
//         {/* Header Empresa */}
//         <View style={styles.header}>
//           <Text style={styles.businessName}>{data.company.name}</Text>
//           <Text style={styles.businessInfo}>RUC: {data.company.ruc}</Text>
//           <Text style={styles.businessInfo}>{data.company.address}</Text>
//         </View>

//         <View style={styles.divider} />

//         {/* Título del Documento */}
//         <Text style={styles.docTitle}>TICKET DE CONSUMO</Text>
//         <Text style={{ fontSize: 7, textAlign: "center", color: "#666" }}>
//           (No válido como comprobante fiscal)
//         </Text>

//         <View style={styles.divider} />

//         {/* Información del Ticket */}
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Ticket:</Text>
//           <Text style={styles.value}>{data.document.number}</Text>
//         </View>
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Fecha:</Text>
//           <Text style={styles.value}>
//             {new Date(data.document.date).toLocaleDateString("es-PE")}
//           </Text>
//         </View>
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Hora:</Text>
//           <Text style={styles.value}>
//             {new Date(data.document.date).toLocaleTimeString("es-PE", {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </Text>
//         </View>
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Mesa:</Text>
//           <Text style={styles.value}>{data.metadata?.mesa || "-"}</Text>
//         </View>
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Cajero:</Text>
//           <Text style={styles.value}>{data.metadata?.cajero || "-"}</Text>
//         </View>

//         <View style={styles.dividerSolid} />

//         {/* Items Header */}
//         <View style={styles.itemsHeader}>
//           <Text style={{ width: "15%" }}>CANT</Text>
//           <Text style={{ flex: 1 }}>DESCRIPCION</Text>
//           <Text style={{ width: "25%", textAlign: "right" }}>TOTAL</Text>
//         </View>

//         {/* Items */}
//         {data.items.map((item, index) => (
//           <View key={index} style={styles.item}>
//             <View style={styles.itemRow}>
//               <Text style={{ width: "15%" }}>{item.quantity}</Text>
//               <Text style={{ flex: 1, fontSize: 8 }}>{item.description}</Text>
//               <Text style={{ width: "25%", textAlign: "right", fontSize: 8 }}>
//                 {item.totalItem.toFixed(2)}
//               </Text>
//             </View>
//             {item.quantity > 1 && (
//               <Text style={{ fontSize: 7, color: "#666", marginLeft: "15%" }}>
//                 @ {item.precioUnitario.toFixed(2)} c/u
//               </Text>
//             )}
//           </View>
//         ))}

//         <View style={styles.dividerSolid} />

//         {/* Totales */}
//         <View style={styles.totals}>
//           <View style={styles.totalRow}>
//             <Text>SUBTOTAL:</Text>
//             <Text>S/ {data.totals.subtotal}</Text>
//           </View>
//           <View style={styles.totalRow}>
//             <Text>IGV (18%):</Text>
//             <Text>S/ {data.totals.igv}</Text>
//           </View>
//           <View style={styles.totalFinal}>
//             <View style={styles.totalRow}>
//               <Text>TOTAL:</Text>
//               <Text>S/ {data.totals.total}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Método de Pago */}
//         <View style={styles.divider} />
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Forma de Pago:</Text>
//           <Text style={styles.value}>{data.payment.method}</Text>
//         </View>
//         {data.payment.montoPagado && (
//           <>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Pago con:</Text>
//               <Text style={styles.value}>
//                 S/ {data.payment.montoPagado.toFixed(2)}
//               </Text>
//             </View>
//             {data.payment.vuelto && data.payment.vuelto > 0 && (
//               <View style={styles.infoRow}>
//                 <Text style={styles.label}>Vuelto:</Text>
//                 <Text style={[styles.value, { fontSize: 9 }]}>
//                   S/ {data.payment.vuelto.toFixed(2)}
//                 </Text>
//               </View>
//             )}
//           </>
//         )}

//         {/* Footer */}
//         <View style={styles.divider} />
//         <View style={styles.footer}>
//           <Text style={styles.footerBold}>¡Gracias por su preferencia!</Text>
//           <Text>Síguenos en redes sociales</Text>
//           <Text>@icemankora</Text>
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
import type { PrintData } from "../../types/billing.types";

// Registrar fuente monoespaciada
Font.register({
  family: "Courier",
  src: "https://fonts.gstatic.com/s/courierprime/v7/u-450q2lgwslOqpF_6gQ8kELWwZjW-_-tvg.ttf",
});

const styles = StyleSheet.create({
  footerThanks: {
    fontSize: 8,
    marginTop: 6,
    color: "#000",
    fontWeight: "bold",
  },
  page: {
    width: "80mm",
    padding: "4mm",
    backgroundColor: "#ffffff",
    fontFamily: "Courier",
    fontSize: 8,
  },
  header: {
    textAlign: "center",
    marginBottom: 6,
  },
  businessName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  businessInfo: {
    fontSize: 8,
    color: "#000",
    marginBottom: 1,
    fontWeight: "bold",
  },
  divider: {
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
  docTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    fontSize: 7,
    color: "#000",
    fontWeight: "bold",
  },
  label: {
    color: "#000",
    fontWeight: "bold",
  },
  value: {
    fontWeight: "bold",
  },
  itemsHeader: {
    flexDirection: "row",
    fontSize: 7,
    fontWeight: "bold",
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  item: {
    marginBottom: 3,
    fontSize: 8,
  },
  itemRow: {
    color: "#00",
    fontWeight: "bold",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totals: {
    marginTop: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    fontSize: 8,
  },
  totalFinal: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  footer: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 7,
  },
  footerBold: {
    fontWeight: "bold",
    marginBottom: 2,
  },
});

interface Props {
  data: PrintData;
}

export const TicketConsumoPDF = ({ data }: Props) => {
  if (!data) return null;

  const estimatedHeight = 400 + (data.items?.length || 0) * 30;

  return (
    <Document>
      <Page size={{ width: 227, height: estimatedHeight }} style={styles.page}>
        {/* Header Empresa */}
        <View style={styles.header}>
          <Text style={styles.businessName}>{data.company.name}</Text>
          <Text style={styles.businessInfo}>RUC: {data.company.ruc}</Text>
          <Text style={styles.businessInfo}>{data.company.address}</Text>
        </View>

        <View style={styles.divider} />

        {/* Título del Documento */}
        <Text style={styles.docTitle}>TICKET DE CONSUMO</Text>
        {/* <Text style={{ fontSize: 7, textAlign: "center", color: "#666" }}>
          (No válido como comprobante fiscal)
        </Text> */}

        <View style={styles.divider} />

        {/* Información del Ticket */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ticket:</Text>
          <Text style={styles.value}>{data.document.number}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {new Date(data.document.date).toLocaleDateString("es-PE")}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Hora:</Text>
          <Text style={styles.value}>
            {new Date(data.document.date).toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Mesa:</Text>
          <Text style={styles.value}>{data.metadata?.mesa || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Cajero:</Text>
          <Text style={styles.value}>{data.metadata?.cajero || "-"}</Text>
        </View>

        <View style={styles.dividerSolid} />

        {/* Items Header */}
        <View style={styles.itemsHeader}>
          <Text style={{ width: "15%" }}>CANT</Text>
          <Text style={{ flex: 1 }}>DESCRIPCION</Text>
          <Text style={{ width: "25%", textAlign: "right" }}>TOTAL</Text>
        </View>

        {/* Items */}
        {data.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemRow}>
              <Text style={{ width: "15%" }}>{item.quantity}</Text>
              <Text style={{ flex: 1, fontSize: 8 }}>{item.description}</Text>
              <Text style={{ width: "25%", textAlign: "right", fontSize: 8 }}>
                {item.totalItem.toFixed(2)}
              </Text>
            </View>
            {item.quantity > 1 && (
              <Text
                style={{
                  fontSize: 7,
                  color: "#000",
                  marginLeft: "15%",
                  fontWeight: "bold",
                }}
              >
                @ {item.precioUnitario.toFixed(2)} c/u
              </Text>
            )}
          </View>
        ))}

        {/* <Viewii style={styles.dividerSolid} /> */}

        {/* Totales */}
        <View style={styles.totals}>
          {/* <View style={styles.totalRow}>
            <Text>SUBTOTAL:</Text>
            <Text>S/ {data.totals.subtotal}</Text>
          </View> */}
          {/* <View style={styles.totalRow}>
            <Text>IGV (18%):</Text>
            <Text>S/ {data.totals.igv}</Text>
          </View> */}
          <View style={styles.totalFinal}>
            <View style={styles.totalRow}>
              <Text>TOTAL:</Text>
              <Text>S/ {Number(data.totals.total).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Método de Pago */}
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Forma de Pago:</Text>
          <Text style={styles.value}>{data.payment.method}</Text>
        </View>
        {data.payment.montoPagado && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Pago con:</Text>
              <Text style={styles.value}>
                S/ {data.payment.montoPagado.toFixed(2)}
              </Text>
            </View>
            {data.payment.vuelto && data.payment.vuelto > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Vuelto:</Text>
                <Text style={[styles.value, { fontSize: 9 }]}>
                  S/ {data.payment.vuelto.toFixed(2)}
                </Text>
              </View>
            )}
          </>
        )}

        {/* Footer */}
        <View style={styles.divider} />
        <View style={styles.footer}>
          <Text style={styles.footerBold}>¡Gracias por su preferencia!</Text>
          {/* <Text>Síguenos en redes sociales</Text>
          <Text>@icemankora</Text> */}
          <Text style={styles.footerThanks}>VUELVA PRONTO</Text>
        </View>
      </Page>
    </Document>
  );
};
