import { useState } from "react";
import { useCashRegister } from "../hooks/useCashRegister";
import { DollarSign, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OpenCashRegisterModal } from "../components/OpenCashRegisterModal";
import { CloseCashRegisterModal } from "../components/CloseCashRegisterModal";
import { CashRegisterHistory } from "../components/CashRegisterHistory";
import { AddIncomeModal } from "../components/AddIncomeModal";
import { AddExpenseModal } from "../components/AddExpenseModal";

const CashRegisterPage = () => {
  const { todayCashRegister, isCashRegisterOpen, isLoading } =
    useCashRegister();
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Control de Caja</h1>

        {!isCashRegisterOpen ? (
          <Button size="lg" onClick={() => setShowOpenModal(true)}>
            <DollarSign className="mr-2" />
            Abrir Caja
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="bg-green-50 hover:bg-green-100 border-green-200"
              onClick={() => setShowIncomeModal(true)}
            >
              <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
              Ingreso Extra
            </Button>
            <Button
              variant="outline"
              className="bg-red-50 hover:bg-red-100 border-red-200"
              onClick={() => setShowExpenseModal(true)}
            >
              <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
              Registrar Gasto
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={() => setShowCloseModal(true)}
            >
              <Clock className="mr-2" />
              Cerrar Caja
            </Button>
          </>
        )}
      </div>

      {isCashRegisterOpen && todayCashRegister && (
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="text-2xl font-bold text-green-600">ABIERTA</p>
              <p className="text-xs text-muted-foreground">
                Desde:{" "}
                {new Date(todayCashRegister.openTime).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto Inicial</p>
              <p className="text-2xl font-bold">
                S/ {parseFloat(todayCashRegister.initialMoney).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cajero</p>
              <p className="text-lg font-semibold">
                {todayCashRegister.user.name}
              </p>
            </div>
          </div>
        </Card>
      )}

      <CashRegisterHistory />

      <OpenCashRegisterModal
        open={showOpenModal}
        onClose={() => setShowOpenModal(false)}
      />

      {isCashRegisterOpen && todayCashRegister && (
        <>
          <CloseCashRegisterModal
            open={showCloseModal}
            onClose={() => setShowCloseModal(false)}
            cashRegisterId={todayCashRegister.id}
          />

          <AddIncomeModal
            open={showIncomeModal}
            onClose={() => setShowIncomeModal(false)}
            cashRegisterId={todayCashRegister.id}
          />
          <AddExpenseModal
            open={showExpenseModal}
            onClose={() => setShowExpenseModal(false)}
            cashRegisterId={todayCashRegister.id}
          />
        </>
      )}
    </div>
  );
};

export default CashRegisterPage;
