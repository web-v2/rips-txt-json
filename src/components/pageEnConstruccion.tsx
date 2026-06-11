import { Construction } from "lucide-react";
import BackToDashboardButton from "./Volver";

export default function PageUnderConstruction() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <Construction className="h-12 w-12 text-primary animate-pulse" />
        </div>

        <h1 className="text-4xl font-bold">
          Página en Construcción 🚧
        </h1>

        <p className="mt-4 text-muted-foreground">
          Esta sección aún se encuentra en desarrollo. Estamos preparando nuevas
          funcionalidades para mejorar tu experiencia.
        </p>

        <div className="mt-8">
          <span className="rounded-full border px-4 py-2 text-sm font-medium">
            Disponible próximamente
          </span>          
        </div>
        
        <div className="mt-6 flex justify-center">
          <BackToDashboardButton />
        </div>
      </div>
    </div>
  );
}