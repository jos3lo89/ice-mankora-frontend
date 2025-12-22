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
    borderTopWidth: 1,
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

  // const subtotal = totalAmount / 1.18;
  // const igv = totalAmount - subtotal;

  // Datos seguros
  // const floorName = order.table?.floor?.name || "PISO 1";
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
          <Text style={styles.businessName}>ICE MANKORA S.A.C</Text>
          {/* <Text style={styles.floorName}>{floorName}</Text> */}
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
        {/* <View style={styles.dividerSolid} /> */}

        {/* Totales */}
        {/* <View style={styles.totals}> */}
        {/* <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SUBTOTAL:</Text>
            <Text style={styles.totalValue}>S/ {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IGV (18%):</Text>
            <Text style={styles.totalValue}>S/ {igv.toFixed(2)}</Text>
          </View> */}
        <View style={styles.totalFinal}>
          <View style={styles.totalRow}>
            <Text>TOTAL:</Text>
            <Text>S/ {totalAmount.toFixed(2)}</Text>
          </View>
        </View>
        {/* </View> */}

        {/* Footer */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerBold}>¡Gracias por su preferencia!</Text>
          <Text style={styles.footerText}>
            Para solicitar su comprobante oficial
          </Text>
          <Text style={styles.footerThanks}>VUELVA PRONTO</Text>
        </View> */}
      </Page>
    </Document>
  );
};
