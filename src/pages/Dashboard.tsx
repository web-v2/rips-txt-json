import { Hospital, Stethoscope, Cog, Repeat, LandPlot, FileText, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">      

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl shadow-lg">
            <LandPlot className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Panel de Control RIPS
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Herramienta profesional para el manejo de RIPS en diferentes formatos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        
        <Link to="/txt-to-json" className="bg-white border border-blue-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <Stethoscope className="w-20 h-20 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-blue-600">Generador TXT a JSON</h2>
          <p className="text-gray-500 mt-2 text-sm">Genera RIPS de formato txt a formato json - capita/pgp.</p>
        </Link>

         <Link to="/json-to-csv" className="bg-white border border-green-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <Repeat className="w-20 h-20 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-green-600">Generador JSON a CSV</h2>
          <p className="text-gray-500 mt-2 text-sm">Genera rips de formato json a formato csv.</p>
        </Link>

        <Link to="/agrupador-json" className="bg-white border border-red-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <Hospital className="w-20 h-20 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-red-600">Agrupador de JSON</h2>
          <p className="text-gray-500 mt-2 text-sm">Se agrupan varios archivos json y se descarga un archivo json/csv.</p>
        </Link>

        <Link to="/extractor-xml" className="bg-white border border-red-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <FileText className="w-20 h-20 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-indigo-600">Extractor XML</h2>
          <p className="text-gray-500 mt-2 text-sm">Se extraen las datos relevantes de las facturas electrónicas.</p>
        </Link>

        <Link to="https://audi-rips-json.netlify.app/" className="bg-white border border-red-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <ClipboardCheck className="w-20 h-20 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-purple-600">Auditoria RIPS JSON</h2>
          <p className="text-gray-500 mt-2 text-sm">Módulo de auditoría para RIPS en formato JSON.</p>          
        </Link>

        <Link to="/config" className="bg-white border border-red-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <Cog className="w-20 h-20 text-orange-600" />
          </div>
          <h2 className="text-lg font-semibold text-orange-600">Configuraciones</h2>
          <p className="text-gray-500 mt-2 text-sm">Módulo de herramientas y configuraciones del sistema.</p>          
        </Link>        

      </div>
    </div>
  );
}

export default Dashboard;

