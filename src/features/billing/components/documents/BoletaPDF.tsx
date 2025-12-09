import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { PrintData } from "../../types/billing.types";

Font.register({
  family: "Courier",
  src: "https://fonts.gstatic.com/s/courierprime/v7/u-450q2lgwslOqpF_6gQ8kELWwZjW-_-tvg.ttf",
});

const styles = StyleSheet.create({
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
    fontSize: 7,
    color: "#000",
    marginBottom: 1,
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
  docBox: {
    border: "2px solid #000",
    padding: 4,
    textAlign: "center",
    marginVertical: 4,
  },
  docTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  docNumber: {
    fontSize: 9,
    fontWeight: "bold",
    marginTop: 2,
  },
  section: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
    textDecoration: "underline",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    fontSize: 7,
  },
  label: {
    color: "#666",
    flex: 1,
  },
  value: {
    fontWeight: "bold",
    flex: 2,
    textAlign: "right",
  },
  itemsHeader: {
    flexDirection: "row",
    fontSize: 7,
    fontWeight: "bold",
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  item: {
    marginBottom: 3,
    fontSize: 8,
  },
  itemRow: {
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
  legalInfo: {
    fontSize: 6,
    textAlign: "center",
    color: "#666",
    marginTop: 6,
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 7,
  },
});

interface Props {
  data: PrintData;
}

export const BoletaPDF = ({ data }: Props) => {
  if (!data) return null;

  const estimatedHeight = 500 + (data.items?.length || 0) * 30;

  return (
    <Document>
      <Page size={{ width: 227, height: estimatedHeight }} style={styles.page}>
        {/* Header Empresa */}
        <View style={styles.header}>
          <Text style={styles.businessName}>{data.company.name}</Text>
          <Text style={styles.businessInfo}>RUC: {data.company.ruc}</Text>
          <Text style={styles.businessInfo}>{data.company.address}</Text>
        </View>

        {/* Tipo de Documento */}
        <View style={styles.docBox}>
          <Text style={styles.docTitle}>BOLETA DE VENTA ELECTRÓNICA</Text>
          <Text style={styles.docNumber}>{data.document.number}</Text>
        </View>

        {/* Datos del Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL CLIENTE:</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {data.client.docType === "1" ? "DNI:" : "Doc:"}
            </Text>
            <Text style={styles.value}>{data.client.doc || "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{data.client.name}</Text>
          </View>
        </View>

        <View style={styles.dividerSolid} />

        {/* Información del Comprobante */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha Emisión:</Text>
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
            <Text style={styles.label}>Moneda:</Text>
            <Text style={styles.value}>{data.document.currency}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Forma de Pago:</Text>
            <Text style={styles.value}>{data.payment.method}</Text>
          </View>
          {data.metadata && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Mesa:</Text>
                <Text style={styles.value}>{data.metadata.mesa}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Cajero:</Text>
                <Text style={styles.value}>{data.metadata.cajero}</Text>
              </View>
            </>
          )}
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
            <Text style={{ fontSize: 7, color: "#666", marginLeft: "15%" }}>
              P.U. S/ {item.precioUnitario.toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.dividerSolid} />

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>OP. GRAVADA:</Text>
            <Text>S/ {data.totals.subtotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>IGV (18%):</Text>
            <Text>S/ {data.totals.igv}</Text>
          </View>
          <View style={styles.totalFinal}>
            <View style={styles.totalRow}>
              <Text>IMPORTE TOTAL:</Text>
              <Text>S/ {data.totals.total}</Text>
            </View>
          </View>
        </View>

        {/* Total en Letras */}
        <View style={{ marginTop: 4 }}>
          <Text style={{ fontSize: 7, fontWeight: "bold" }}>
            {data.totals.totalLetters}
          </Text>
        </View>

        {/* Método de Pago con Vuelto */}
        {data.payment.montoPagado && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.label}>Pago con:</Text>
              <Text style={styles.value}>
                S/ {data.payment.montoPagado.toFixed(2)}
              </Text>
            </View>
            {data.payment.vuelto && data.payment.vuelto > 0 && (
              <View style={styles.infoRow}>
                <Text
                  style={[styles.label, { fontSize: 8, fontWeight: "bold" }]}
                >
                  VUELTO:
                </Text>
                <Text style={[styles.value, { fontSize: 9 }]}>
                  S/ {data.payment.vuelto.toFixed(2)}
                </Text>
              </View>
            )}
          </>
        )}

        <View style={styles.divider} />

        {/* Información Legal */}
        <View style={styles.legalInfo}>
          <Text>Representación impresa de la Boleta Electrónica</Text>
          <Text>Autorizada mediante Resolución de Superintendencia</Text>
          <Text>N° 097-2012/SUNAT y modificatorias</Text>
          <Text style={{ marginTop: 3 }}>
            {data.sunat.status === "ACEPTADO"
              ? "✓ Documento enviado y aceptado por SUNAT"
              : data.sunat.status === "PENDIENTE"
              ? "⏳ Documento pendiente de envío a SUNAT"
              : "⚠ Documento con observaciones"}
          </Text>
          {data.sunat.hash && (
            <Text style={{ marginTop: 2, fontSize: 5 }}>
              Hash: {data.sunat.hash.substring(0, 40)}...
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontWeight: "bold" }}>¡Gracias por su compra!</Text>
          <Text>Consulte su documento en:</Text>
          <Text style={{ fontSize: 6 }}>www.icemankora.com/consulta</Text>
        </View>
      </Page>
    </Document>
  );
};
