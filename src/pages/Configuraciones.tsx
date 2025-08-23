import RIPSBaseExcel from '@/components/RIPSBaseExcel';
import CupsLinkSISPRO from '@/components/CupsLinkSISPRO';
import { Card, CardContent } from '@/components/ui/card';
import BackToDashboardButton from '@/components/Volver';
import Footer from '../components/Footer';
import { Cog } from 'lucide-react';
import TablasReferenciasView from '@/components/TablasReferenciasView';
import Cie10LinkSISPRO from '@/components/Cie10LinkSISPRO';


function Configuraciones() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl shadow-lg">
                <Cog className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Módulo de Ayudas
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramientas para facilitar la gestión de los RIPS
            </p>
          </div>        

        <div className="flex gap-4">
          <BackToDashboardButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-6xl">        
          <RIPSBaseExcel />
          <TablasReferenciasView />
          <CupsLinkSISPRO />
          <Cie10LinkSISPRO />
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

