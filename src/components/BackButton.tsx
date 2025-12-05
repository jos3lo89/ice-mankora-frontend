import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string; // opcional
  title?: string;
}

const BackButton = ({ to, title }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to); // Ir a la ruta indicada
    } else {
      navigate(-1); // Volver atrás si no se pasa ruta
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="flex items-center gap-2 cursor-pointer dark:hover:text-white/90"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{title || "Volver"}</span>
    </Button>
  );
};

export default BackButton;
