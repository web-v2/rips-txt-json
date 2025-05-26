
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, FileText, Users, Activity } from 'lucide-react';
import { RipsService } from '../services/rips.service';
import { RIPS, Usuario, Consulta, Procedimiento } from '../types/rips.interfaces';
import { useToast } from '@/hooks/use-toast';


const RipsGenerator = () => {
  const [usuarioFile, setUsuarioFile] = useState<File | null>(null);
  const [consultasFile, setConsultasFile] = useState<File | null>(null);
  const [procedimientosFile, setProcedimientosFile] = useState<File | null>(null);
  const [numDocumentoIdObligado, setNumDocumentoIdObligado] = useState('');
  const [numFactura, setNumFactura] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ripsData, setRipsData] = useState<RIPS | null>(null);
  const [estadisticas, setEstadisticas] = useState<{
    usuarios: number;
    consultas: number;
    procedimientos: number;
  } | null>(null);

  const ripsService = new RipsService();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, tipo: 'usuario' | 'consultas' | 'procedimientos') => {
    const file = event.target.files?.[0];
    if (file) {
      switch (tipo) {
        case 'usuario':
          setUsuarioFile(file);
          break;
        case 'consultas':
          setConsultasFile(file);
          break;
        case 'procedimientos':
          setProcedimientosFile(file);
          break;
      }
    }
  };

  const validateFiles = (): boolean => {
    if (!usuarioFile || !consultasFile || !procedimientosFile) {
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
      const consultas: Consulta[] = await ripsService.parseConsultas(consultasFile!);
      
      setProgress(60);
      const procedimientos: Procedimiento[] = await ripsService.parseProcedimientos(procedimientosFile!);

      // Agregar datos
      setProgress(80);
      const rips = ripsService.aggregateData(
        usuarios, 
        consultas, 
        procedimientos, 
        numDocumentoIdObligado.trim(), 
        numFactura.trim()
      );

      setProgress(100);
      setRipsData(rips);
      setEstadisticas({
        usuarios: usuarios.length,
        consultas: consultas.length,
        procedimientos: procedimientos.length
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Generador de Archivos RIPS</h1>
          <p className="text-lg text-gray-600">Procesa archivos de usuarios, consultas y procedimientos para generar el RIPS en JSON </p>
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
              Selecciona los archivos .txt con los datos de usuarios, consultas y procedimientos
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
                <Label htmlFor="consultasFile" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Archivo de Consultas
                </Label>
                <Input
                  id="consultasFile"
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileChange(e, 'consultas')}
                />
                {consultasFile && (
                  <p className="text-sm text-green-600">✓ {consultasFile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedimientosFile" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Archivo de Procedimientos
                </Label>
                <Input
                  id="procedimientosFile"
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileChange(e, 'procedimientos')}
                />
                {procedimientosFile && (
                  <p className="text-sm text-green-600">✓ {procedimientosFile.name}</p>
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
                  <p className="text-2xl font-bold text-green-600">{estadisticas.consultas.toLocaleString("es-ES")}</p>
                  <p className="text-sm text-gray-600">Consultas</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{estadisticas.procedimientos.toLocaleString("es-ES")}</p>
                  <p className="text-sm text-gray-600">Procedimientos</p>
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
            <div className="flex flex-col md:flex-row justify-between items-center text-center gap-4 py-4">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Samir Vergara. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6 text-sm text-gray-500">
                <span>Versión 1.0</span>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default RipsGenerator;
