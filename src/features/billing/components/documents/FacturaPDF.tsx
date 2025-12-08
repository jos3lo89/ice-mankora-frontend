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
    color: "#333",
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
  dividerDouble: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    marginVertical: 4,
  },
  docBox: {
    border: "2px solid #000",
    padding: 4,
    textAlign: "center",
    marginVertical: 4,
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#e0e0e0",
    padding: 2,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 2,
    fontSize: 7,
  },
  label: {
    color: "#666",
    width: "40%",
  },
  value: {
    fontWeight: "bold",
    width: "60%",
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
    fontSize: 7,
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

export const FacturaPDF = ({ data }: Props) => {
  if (!data) return null;

  const estimatedHeight = 550 + (data.items?.length || 0) * 30;

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
          <Text style={styles.docTitle}>FACTURA ELECTRÓNICA</Text>
          <Text style={styles.docNumber}>{data.document.number}</Text>
        </View>

        {/* Datos del Adquirente (Cliente) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL ADQUIRENTE:</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>RUC:</Text>
            <Text style={styles.value}>{data.client.doc}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Razón Social:</Text>
            <Text style={styles.value}>{data.client.name}</Text>
          </View>
          {data.client.address && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Dirección:</Text>
              <Text style={styles.value}>{data.client.address}</Text>
            </View>
          )}
        </View>

        <View style={styles.dividerSolid} />

        {/* Información del Comprobante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL COMPROBANTE:</Text>
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
                second: "2-digit",
              })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Moneda:</Text>
            <Text style={styles.value}>{data.document.currency}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tipo de Venta:</Text>
            <Text style={styles.value}>CONTADO</Text>
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
                <Text style={styles.label}>Orden:</Text>
                <Text style={styles.value}>{data.metadata.orden}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Atendido por:</Text>
                <Text style={styles.value}>{data.metadata.cajero}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.dividerDouble} />

        {/* Items Header */}
        <View style={styles.itemsHeader}>
          <Text style={{ width: "12%" }}>CANT</Text>
          <Text style={{ flex: 1 }}>DESCRIPCION</Text>
          <Text style={{ width: "22%", textAlign: "right" }}>P.U.</Text>
          <Text style={{ width: "22%", textAlign: "right" }}>TOTAL</Text>
        </View>

        {/* Items */}
        {data.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemRow}>
              <Text style={{ width: "12%" }}>{item.quantity}</Text>
              <Text style={{ flex: 1, fontSize: 7 }}>{item.description}</Text>
              <Text style={{ width: "22%", textAlign: "right", fontSize: 7 }}>
                {item.precioUnitario.toFixed(2)}
              </Text>
              <Text style={{ width: "22%", textAlign: "right", fontSize: 7 }}>
                {item.totalItem.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.dividerDouble} />

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>OP. GRAVADA:</Text>
            <Text>S/ {data.totals.subtotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>OP. EXONERADA:</Text>
            <Text>S/ 0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>OP. INAFECTA:</Text>
            <Text>S/ 0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>IGV (18%):</Text>
            <Text>S/ {data.totals.igv}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>ICBPER:</Text>
            <Text>S/ 0.00</Text>
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

        <View style={styles.dividerDouble} />

        {/* Información Legal SUNAT */}
        <View style={styles.legalInfo}>
          <Text style={{ fontWeight: "bold", fontSize: 7, marginBottom: 2 }}>
            REPRESENTACIÓN IMPRESA DE LA FACTURA ELECTRÓNICA
          </Text>
          <Text>Autorizada mediante Resolución de Superintendencia</Text>
          <Text>N° 188-2010/SUNAT y modificatorias</Text>
          <Text style={{ marginTop: 3 }}>
            Esta factura se encuentra almacenada en el Sistema
          </Text>
          <Text>de Emisión Electrónica de SUNAT</Text>
          <Text style={{ marginTop: 3 }}>
            {data.sunat.status === "ACEPTADO"
              ? "✓ Documento enviado y aceptado por SUNAT"
              : data.sunat.status === "PENDIENTE"
              ? "⏳ Documento pendiente de envío a SUNAT"
              : "⚠ Documento con observaciones"}
          </Text>
          {/* {data.sunat.hash && (
            <Text style={{ marginTop: 3, fontSize: 5, wordBreak: "break-all" }}>
              Firma Digital: {data.sunat.hash.substring(0, 50)}...
            </Text>
          )} */}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontWeight: "bold" }}>
            ¡Gracias por su preferencia!
          </Text>
          <Text>Consulte su documento en:</Text>
          <Text style={{ fontSize: 6 }}>www.icemankora.com/consulta</Text>
          <Text style={{ fontSize: 6, marginTop: 2 }}>
            Reclamos: libro.reclamaciones@icemankora.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};
