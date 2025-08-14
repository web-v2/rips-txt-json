import RIPSBaseExcel from '@/components/RIPSBaseExcel';
import TablasReferenciasExcel from '@/components/TablasReferenciasExcel';
import { Card, CardContent } from '@/components/ui/card';
import BackToDashboardButton from '@/components/Volver';
import Footer from '../components/Footer';


function Configuraciones() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">  
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Módulo de Ayudas</h1>
          <p className="text-lg text-gray-600">Descargue la base de los RIPS en formato excel o navegue a las tablas de referencias del SISPRO</p>
        </div>

        <div className="flex gap-4">
          <BackToDashboardButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-6xl">        
          <RIPSBaseExcel />
          <TablasReferenciasExcel />          
        </div>

        <Card className="shadow-none border-t mt-8">
            <CardContent>
                <Footer />
            </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default Configuraciones;

