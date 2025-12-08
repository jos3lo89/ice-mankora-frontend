import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  title?: string;
}

const BackButton = ({ to, title }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
      return;
    }
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
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
