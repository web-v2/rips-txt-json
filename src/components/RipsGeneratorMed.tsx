
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, FileText, Users, Activity } from 'lucide-react';
import { RipsService } from '../services/rips.service';
import { RIPS, Usuario, Medicamento, OtrosServicio } from '../types/rips.interfaces';
import { useToast } from '@/hooks/use-toast';
import BackToDashboardButton from './Volver';
import Footer from './Footer';


const RipsGeneratorMed = () => {
  const [usuarioFile, setUsuarioFile] = useState<File | null>(null);
  const [medicamentosFile, setMedicamentosFile] = useState<File | null>(null);
  const [otrosServiciosFile, setOtrosServiciosFile] = useState<File | null>(null);

  const [numDocumentoIdObligado, setNumDocumentoIdObligado] = useState('');
  const [numFactura, setNumFactura] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ripsData, setRipsData] = useState<RIPS | null>(null);
  const [estadisticas, setEstadisticas] = useState<{
    usuarios: number;
    medicamentos: number;
    otrosServicios: number;
  } | null>(null);

  const ripsService = new RipsService();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, tipo: 'usuario' | 'medicamentos' | 'otrosServicios') => {
    const file = event.target.files?.[0];
    if (file) {
      switch (tipo) {
        case 'usuario':
          setUsuarioFile(file);
          break;       
        case 'medicamentos':
          setMedicamentosFile(file);
          break;
        case 'otrosServicios':
          setOtrosServiciosFile(file);
          break;
      }
    }
  };

  const validateFiles = (): boolean => {
    if (!usuarioFile || !medicamentosFile || !otrosServiciosFile) {
      toast({
        title: "Archivos faltantes",
        description: "Por favor selecciona todos los archivos requeridos.",
        variant: "destructive"
      });
      return false;
    }

    if (!numDocumentoIdObligado.trim() || !numFactura.trim()) {
      toast({
        title: "Datos faltantes",
        description: "Por favor completa el número de documento del obligado y el número de factura.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const generateRips = async () => {
    if (!validateFiles()) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Parsear archivos
      setProgress(20);
      const usuarios: Usuario[] = await ripsService.parseUsuarios(usuarioFile!);
      
      setProgress(40);
      const medicamentos: Medicamento[] = await ripsService.parseMedicamentos(medicamentosFile!);
      
      setProgress(60);
      const otrosServ: OtrosServicio[] = await ripsService.parseOtrosServicios(otrosServiciosFile!);

      // Agregar datos
      setProgress(80);
      const rips = ripsService.aggregateDataMed(
        usuarios, 
        medicamentos, 
        otrosServ, 
        numDocumentoIdObligado.trim(), 
        numFactura.trim()
      );

      setProgress(100);
      setRipsData(rips);
      setEstadisticas({
        usuarios: usuarios.length,
        medicamentos: medicamentos.length,
        otrosServicios: otrosServ.length
      });

      toast({
        title: "¡Éxito!",
        description: "El archivo RIPS ha sido generado correctamente.",
      });

    } catch (error) {
      console.error('Error procesando archivos:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar los archivos. Verifica el formato.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadRips = () => {
    if (ripsData) {
      const filename = `${numFactura}_${new Date().toISOString().split('T')[0]}.json`;
      ripsService.downloadJson(ripsData, filename);
      
      toast({
        title: "Descarga iniciada",
        description: `El archivo ${filename} se está descargando.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">  
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Generador de RIPS JSON - Módulo 2</h1>
          <p className="text-lg text-gray-600">Procesa archivos de usuarios, medicamentos y otros servicios en formato TXT para generar el RIPS en JSON.</p>
        </div>

        <div className="flex gap-4">
          <BackToDashboardButton />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información General
            </CardTitle>
            <CardDescription>
              Completa los datos básicos del archivo RIPS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numDocumentoIdObligado">Número de Documento ID Obligado</Label>
                <Input
                  id="numDocumentoIdObligado"
                  value={numDocumentoIdObligado}
                  onChange={(e) => setNumDocumentoIdObligado(e.target.value)}
                  placeholder="Ej: 900656493"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numFactura">Número de Factura</Label>
                <Input
                  id="numFactura"
                  value={numFactura}
                  onChange={(e) => setNumFactura(e.target.value)}
                  placeholder="Ej: FEPV85000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Cargar Archivos
            </CardTitle>
            <CardDescription>
              Selecciona los archivos .txt con los datos de usuarios, medicamentos y otros servicios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usuarioFile" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Archivo de Usuarios
                </Label>
                <Input
                  id="usuarioFile"
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileChange(e, 'usuario')}
                />
                {usuarioFile && (
                  <p className="text-sm text-green-600">✓ {usuarioFile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicamentosFile" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Archivo de Medicamentos
                </Label>
                <Input
                  id="medicamentosFile"
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileChange(e, 'medicamentos')}
                />
                {medicamentosFile && (
                  <p className="text-sm text-green-600">✓ {medicamentosFile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="otrosServFile" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Archivo de Otros Servicios
                </Label>
                <Input
                  id="otrosServFile"
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileChange(e, 'otrosServicios')}
                />
                {otrosServiciosFile && (
                  <p className="text-sm text-green-600">✓ {otrosServiciosFile.name}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isProcessing && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Procesando archivos...</p>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500">{progress}% completado</p>
              </div>
            </CardContent>
          </Card>
        )}

        {estadisticas && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Estadísticas del Procesamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{estadisticas.usuarios.toLocaleString("es-ES")}</p>
                  <p className="text-sm text-gray-600">Usuarios</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{estadisticas.medicamentos.toLocaleString("es-ES")}</p>
                  <p className="text-sm text-gray-600">Medicamentos</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{estadisticas.otrosServicios.toLocaleString("es-ES")}</p>
                  <p className="text-sm text-gray-600">Otros Servicios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={generateRips} 
            disabled={isProcessing} 
            className="flex-1 h-12 text-lg"
          >
            {isProcessing ? 'Procesando...' : 'Generar RIPS'}
          </Button>
          
          {ripsData && (
            <Button 
              onClick={downloadRips} 
              variant="outline" 
              className="flex items-center gap-2 h-12"
            >
              <Download className="h-4 w-4" />
              Descargar JSON
            </Button>
          )}
        </div>

        {ripsData && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              ¡Archivo RIPS generado exitosamente! Haz clic en "Descargar JSON" para obtener el archivo.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-none border-t mt-8">
          <CardContent>
            <Footer />
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default RipsGeneratorMed;
