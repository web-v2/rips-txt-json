import { Layers, MousePointerClick } from "lucide-react";

const TablasReferenciasView = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">      
      <div className="mb-4">
        <Layers className="w-20 h-20 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Ver Tablas de Referencias</h2>
      <a
        href="/TablesReferences"               
        className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700 transition-colors duration-300"
      >
        <MousePointerClick />
        Ver
      </a>     
    </div>
  );
};

export default TablasReferenciasView;
