import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-2px, 2px); }
          94% { transform: translate(2px, -2px); }
          96% { transform: translate(-2px, -2px); }
          98% { transform: translate(2px, 2px); }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .glitch-animation {
          animation: glitch 8s ease-in-out infinite;
        }
      `}</style>

      <header className="flex items-center justify-end p-4">
        <ModeToggle />
      </header>
      <div className="flex items-center justify-center bg-background mt-10">
        <div className="text-center space-y-6">
          <h1 className="text-8xl font-bold text-primary float-animation glitch-animation">
            404
          </h1>

          <div className="space-y-2 fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <h2 className="text-4xl font-semibold text-foreground">
              Página No Encontrada
            </h2>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
              Lo sentimos, no pudimos encontrar la página que buscas. Tal vez se
              haya movido o ya no existe.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4 fade-in" style={{ animationDelay: "0.4s", opacity: 0 }}>
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
