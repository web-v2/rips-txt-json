import { Globe, MousePointerClick } from "lucide-react";

const Cie10LinkSISPRO = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">      
      <div className="mb-4">
        <Globe className="w-20 h-20 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">CIE-10</h2>
      <a
        href="https://web.sispro.gov.co/WebPublico/Consultas/ConsultarDetalleReferenciaBasica.aspx?Code=CIE10"
        target="_blank"        
        className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700 transition-colors duration-300"
      >
        <MousePointerClick />
        SISPRO
      </a>
    </div>
  );
};

export default Cie10LinkSISPRO;
