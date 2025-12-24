import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { cashRegisterApi } from "../services/caja.service";
import { CashRegisterPDF } from "../components/CashRegisterPDF";

const CashRegisterPDFView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["cash-register", "details", id],
    queryFn: () => cashRegisterApi.getDetailsPdf(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No se encontró la información de la caja</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-center gap-2">
          <PDFDownloadLink
            document={<CashRegisterPDF data={data} />}
            fileName={`caja-${data.cashRegister.id}-${
              new Date().toISOString().split("T")[0]
            }.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Preparando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </>
                )}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="flex-1">
        <PDFViewer width="100%" height="100%">
          <CashRegisterPDF data={data} />
        </PDFViewer>
      </div>
    </div>
  );
};
export default CashRegisterPDFView;
