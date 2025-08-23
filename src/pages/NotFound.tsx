import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import BackToDashboardButton from "@/components/Volver";
import { Card, CardContent } from "@/components/ui/card";


const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="py-10 flex flex-col items-center">
          <div className="bg-gradient-to-r from-red-500 to-red-500 p-4 rounded-full shadow-lg mb-4">
            <ShieldAlert className="h-12 w-12 bg-red-500 text-white" />
          </div>
          <h1 className="text-6xl font-extrabold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-2xl font-semibold text-muted-foreground mb-2">
            ¡Página no encontrada!
          </p>
          <p className="text-center text-muted-foreground mb-6">
            La ruta <span className="font-mono bg-muted px-2 py-1 rounded">{location.pathname}</span> no existe.<br />
            Es posible que la dirección esté mal escrita o el recurso haya sido movido.
          </p>
          <BackToDashboardButton />
        </CardContent>
      </Card>      
    </div>
  );
};

export default NotFound;