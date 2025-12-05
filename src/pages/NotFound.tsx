import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className="flex items-center justify-end p-4">
        <ModeToggle />
      </header>
      <div className="flex items-center justify-center bg-background mt-10">
        <div className="text-center space-y-6">
          <h1 className="text-8xl font-bold text-primary">404</h1>

          <div className="space-y-2">
            <h2 className="text-4xl font-semibold text-foreground">
              Página No Encontrada
            </h2>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
              Lo sentimos, no pudimos encontrar la página que buscas. Tal vez se
              haya movido o ya no existe.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={() => navigate(-1)} className="gap-2" size="lg">
              <ArrowLeft className="w-4 h-4" />
              Volver Atrás
            </Button>

            <Button onClick={() => navigate("/")} variant="outline" size="lg">
              Ir al Inicio
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
