import { forwardRef } from "react";
import type { PrintData } from "../types/billing.types";

interface Props {
  data: PrintData | null;
}

// forwardRef es OBLIGATORIO para react-to-print
export const Ticket = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  if (!data) return null;

  return (
    <div
      ref={ref}
      className="p-4 w-[80mm] font-mono text-xs text-black bg-white"
    >
      {/* CABECERA */}
      <div className="text-center mb-4 border-b border-dashed pb-2">
        <h2 className="font-bold text-sm">{data.company.name}</h2>
        <p>RUC: {data.company.ruc}</p>
        <p>{data.company.address}</p>
        <div className="mt-2">
          <p className="font-bold">{data.document.type}</p>
          <p>{data.document.number}</p>
        </div>
        <p>{new Date(data.document.date).toLocaleString()}</p>
      </div>

      {/* CLIENTE */}
      <div className="mb-4 border-b border-dashed pb-2">
        <p>
          <strong>Cliente:</strong> {data.client.name}
        </p>
        <p>
          <strong>DOC:</strong> {data.client.doc}
        </p>
        {data.client.address && <p>Dir: {data.client.address}</p>}
      </div>

      {/* ITEMS */}
      <div className="mb-4 border-b border-dashed pb-2">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="w-8">Cant.</th>
              <th>Desc.</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index}>
                <td className="align-top">{item.quantity}</td>
                <td className="align-top">{item.description}</td>
                <td className="align-top text-right">
                  {data.document.currency === "PEN" ? "S/" : "$"}{" "}
                  {Number(item.totalItem).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALES */}
      <div className="text-right mb-4">
        <p>Op. Gravada: {Number(data.totals.subtotal).toFixed(2)}</p>
        <p>IGV (18%): {Number(data.totals.igv).toFixed(2)}</p>
        <p className="text-sm font-bold mt-1">
          TOTAL A PAGAR: {data.document.currency === "PEN" ? "S/" : "$"}{" "}
          {Number(data.totals.total).toFixed(2)}
        </p>
      </div>

      <p className="text-center text-[10px] uppercase mb-4">
        {data.totals.totalLetters}
      </p>

      {/* PIE DE PÁGINA (Fake SUNAT text) */}
      <div className="text-center text-[10px]">
        <p>Representación Impresa del Comprobante Electrónico</p>
        <p>Gracias por su preferencia</p>
        <p>Ice Mankora</p>
      </div>
    </div>
  );
});

Ticket.displayName = "Ticket";
