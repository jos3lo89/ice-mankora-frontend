import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 cursor-pointer dark:hover:text-white/90"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Volver</span>
    </Button>
  );
};
export default BackButton;
