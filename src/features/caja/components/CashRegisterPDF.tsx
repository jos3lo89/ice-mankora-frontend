import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CashRegisterDetailsPdf } from "../types/caja.types";

// Registrar fuentes si las necesitas (opcional)
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
  },
  value: {
    fontSize: 9,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    padding: 5,
    fontWeight: "bold",
    fontSize: 8,
    borderBottom: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    fontSize: 8,
    borderBottom: 0.5,
    borderBottomColor: "#ccc",
  },
  col1: { width: "10%" },
  col2: { width: "20%" },
  col3: { width: "15%" },
  col4: { width: "15%" },
  col5: { width: "20%" },
  col6: { width: "20%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderTop: 2,
    borderTopColor: "#000",
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridItem: {
    width: "48%",
  },
  badge: {
    padding: 3,
    borderRadius: 3,
    textAlign: "center",
    fontSize: 8,
    marginTop: 3,
  },
  badgeSuccess: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  badgeWarning: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  badgeDanger: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
});

interface CashRegisterPDFProps {
  data: CashRegisterDetailsPdf;
}

export const CashRegisterPDF = ({ data }: CashRegisterPDFProps) => {
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "S/ 0.00";
    return `S/ ${parseFloat(value.toString()).toFixed(2)}`;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE DE CAJA</Text>
          <Text style={styles.subtitle}>
            {data.cashRegister.status === "ABIERTA"
              ? "Caja Abierta - Corte Parcial"
              : "Cierre de Caja"}
          </Text>
          {/* <Text style={{ fontSize: 9, textAlign: "center", marginTop: 5 }}>
            ID: {data.cashRegister.id}
          </Text> */}
        </View>

        {/* INFORMACIÓN GENERAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN GENERAL</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Cajero:</Text>
                <Text style={styles.value}>{data.cashRegister.user.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Usuario:</Text>
                <Text style={styles.value}>
                  {data.cashRegister.user.username}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Rol:</Text>
                <Text style={styles.value}>{data.cashRegister.user.role}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Apertura:</Text>
                <Text style={styles.value}>
                  {formatDate(data.cashRegister.openTime)}
                </Text>
              </View>
              {data.cashRegister.closeTime && (
                <View style={styles.row}>
                  <Text style={styles.label}>Cierre:</Text>
                  <Text style={styles.value}>
                    {formatDate(data.cashRegister.closeTime)}
                  </Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Duración:</Text>
                <Text style={styles.value}>
                  {data.cashRegister.duracionHoras} horas
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* RESUMEN DE DINERO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RESUMEN DE DINERO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Dinero Inicial:</Text>
            <Text style={styles.value}>
              {formatCurrency(data.totales.inicial)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ventas:</Text>
            <Text style={styles.value}>
              {formatCurrency(data.totales.ventas)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ingresos Extras:</Text>
            <Text style={styles.value}>
              {formatCurrency(data.totales.ingresosExtras)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Egresos:</Text>
            <Text style={styles.value}>
              -{formatCurrency(data.totales.egresos)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Dinero Esperado:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(data.totales.esperado)}
            </Text>
          </View>
          {data.totales.contado !== null && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Dinero Contado:</Text>
                <Text style={styles.value}>
                  {formatCurrency(data.totales.contado)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Diferencia:</Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color:
                        (data.totales.diferencia || 0) === 0
                          ? "green"
                          : (data.totales.diferencia || 0) > 0
                          ? "blue"
                          : "red",
                    },
                  ]}
                >
                  {formatCurrency(data.totales.diferencia)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* ESTADÍSTICAS DE VENTAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ESTADÍSTICAS DE VENTAS</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Total de Ventas:</Text>
                <Text style={styles.value}>{data.ventas.total}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Monto Total:</Text>
                <Text style={styles.value}>
                  {formatCurrency(data.ventas.monto)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Venta Promedio:</Text>
                <Text style={styles.value}>
                  {formatCurrency(data.estadisticas.ventaPromedio)}
                </Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Venta Más Alta:</Text>
                <Text style={styles.value}>
                  {formatCurrency(data.estadisticas.ventaMasAlta)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Venta Más Baja:</Text>
                <Text style={styles.value}>
                  {formatCurrency(data.estadisticas.ventaMasBaja)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Cancelaciones:</Text>
                <Text style={styles.value}>
                  {data.estadisticas.totalCancelaciones}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* VENTAS POR MÉTODO DE PAGO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VENTAS POR MÉTODO DE PAGO</Text>
          {Object.entries(data.ventas.porMetodo).map(([method, details]) => (
            <View key={method} style={styles.row}>
              <Text style={styles.label}>{method}:</Text>
              <Text style={styles.value}>
                {details.count} ventas - {formatCurrency(details.total)}
              </Text>
            </View>
          ))}
        </View>

        {/* VENTAS POR TIPO DE COMPROBANTE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            VENTAS POR TIPO DE COMPROBANTE
          </Text>
          {Object.entries(data.ventas.porTipo).map(([type, details]) => (
            <View key={type} style={styles.row}>
              <Text style={styles.label}>{type}:</Text>
              <Text style={styles.value}>
                {details.count} comprobantes - {formatCurrency(details.total)}
              </Text>
            </View>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            Generado: {new Date().toLocaleString("es-PE")} | Sistema POS ICE
            MANKORA
          </Text>
        </View>
      </Page>

      {/* PÁGINA 2: DETALLE DE VENTAS */}
      {data.ventas.listado.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>DETALLE DE VENTAS</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>N°</Text>
              <Text style={styles.col2}>Comprobante</Text>
              <Text style={styles.col3}>Tipo/Pago</Text>
              <Text style={styles.col4}>Cliente</Text>
              <Text style={styles.col5}>Mesa/Orden</Text>
              <Text style={styles.col6}>Total</Text>
            </View>

            {data.ventas.listado.slice(0, 30).map((sale, index) => (
              <View key={sale.id} style={styles.tableRow}>
                <Text style={styles.col1}>{index + 1}</Text>
                <Text style={styles.col2}>{sale.numeroComprobante}</Text>
                <Text style={styles.col3}>
                  {sale.type} / {sale.paymentMethod}
                </Text>
                <Text style={styles.col4}>{sale.cliente}</Text>
                <Text style={styles.col5}>
                  {sale.mesa} / #{sale.ordenNumero}
                </Text>
                <Text style={styles.col6}>{formatCurrency(sale.total)}</Text>
              </View>
            ))}
          </View>

          {data.ventas.listado.length > 30 && (
            <Text style={{ marginTop: 10, fontSize: 8, fontStyle: "italic" }}>
              Mostrando 30 de {data.ventas.listado.length} ventas
            </Text>
          )}
        </Page>
      )}

      {/* PÁGINA 3: MOVIMIENTOS MANUALES */}
      {(data.movimientos.ingresosExtras.length > 0 ||
        data.movimientos.egresos.length > 0) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>MOVIMIENTOS MANUALES</Text>
          </View>

          {/* Ingresos Extras */}
          {data.movimientos.ingresosExtras.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INGRESOS EXTRAS</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={{ width: "20%" }}>Fecha</Text>
                  <Text style={{ width: "50%" }}>Descripción</Text>
                  <Text style={{ width: "30%" }}>Monto</Text>
                </View>
                {data.movimientos.ingresosExtras.map((mov) => (
                  <View key={mov.id} style={styles.tableRow}>
                    <Text style={{ width: "20%" }}>
                      {formatDate(mov.createdAt)}
                    </Text>
                    <Text style={{ width: "50%" }}>{mov.description}</Text>
                    <Text style={{ width: "30%" }}>
                      {formatCurrency(mov.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Egresos */}
          {data.movimientos.egresos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EGRESOS</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={{ width: "20%" }}>Fecha</Text>
                  <Text style={{ width: "50%" }}>Descripción</Text>
                  <Text style={{ width: "30%" }}>Monto</Text>
                </View>
                {data.movimientos.egresos.map((mov) => (
                  <View key={mov.id} style={styles.tableRow}>
                    <Text style={{ width: "20%" }}>
                      {formatDate(mov.createdAt)}
                    </Text>
                    <Text style={{ width: "50%" }}>{mov.description}</Text>
                    <Text style={{ width: "30%" }}>
                      -{formatCurrency(mov.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Page>
      )}

      {/* PÁGINA 4: CANCELACIONES */}
      {data.movimientos.cancelaciones.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>PEDIDOS CANCELADOS</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={{ width: "15%" }}>Orden</Text>
              <Text style={{ width: "20%" }}>Mesa</Text>
              <Text style={{ width: "35%" }}>Motivo</Text>
              <Text style={{ width: "15%" }}>Autorizado</Text>
              <Text style={{ width: "15%" }}>Total</Text>
            </View>

            {data.movimientos.cancelaciones.map((cancel) => (
              <View key={cancel.id} style={styles.tableRow}>
                <Text style={{ width: "15%" }}>#{cancel.orderNumber}</Text>
                <Text style={{ width: "20%" }}>
                  {cancel.tableName} ({cancel.tableNumber})
                </Text>
                <Text style={{ width: "35%" }}>{cancel.reason}</Text>
                <Text style={{ width: "15%" }}>{cancel.authorizedBy}</Text>
                <Text style={{ width: "15%" }}>
                  {formatCurrency(cancel.totalPedido)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Cancelado:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(data.estadisticas.montoCancelado)}
            </Text>
          </View>
        </Page>
      )}
    </Document>
  );
};
