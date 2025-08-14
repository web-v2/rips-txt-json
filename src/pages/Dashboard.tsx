import { Hospital, Stethoscope, Syringe, Cog} from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Control RIPS</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        
        <Link to="/mod1" className="bg-white border border-blue-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <Stethoscope className="w-20 h-20 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-blue-600">Generador RIPS Módulo 1</h2>
          <p className="text-gray-500 mt-2 text-sm">RIPS de Consultas y Procedimientos.</p>
        </Link>

        <Link to="/mod2" className="bg-white border border-green-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <Syringe className="w-20 h-20 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-green-600">Generador RIPS Módulo 2</h2>
          <p className="text-gray-500 mt-2 text-sm">RIPS de Medicamentos y Otros Servicios.</p>
        </Link>

        <Link to="/mod3" className="bg-white border border-red-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <Hospital className="w-20 h-20 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-red-600">Generador RIPS Módulo 3</h2>
          <p className="text-gray-500 mt-2 text-sm">Se procesan todos los archivos</p>
        </Link>

        <Link to="/config" className="bg-white border border-red-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center w-full max-w-xs mx-auto">
          <div className="mb-4">
            <Cog className="w-20 h-20 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-indigo-600">Configuraciones</h2>
          <p className="text-gray-500 mt-2 text-sm">Descargue archivos de ayuda</p>          
        </Link>

      </div>
    </div>
  );
}

export default Dashboard;

