
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, FileText, Files, Stethoscope, Repeat } from 'lucide-react';
import { RipsService } from '../services/rips.service';
import { RIPS } from '../types/rips.interfaces';
import { useToast } from '@/hooks/use-toast';
import BackToDashboardButton from './Volver';
import Footer from './Footer';


const RipsJsonToTXT = () => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [csvFiles, setCsvFiles] = useState<{
    transaccionCSV?: string;
    usuariosCSV?: string;
    consultasCSV?: string;
    procedimientosCSV?: string;
    urgenciasCSV?: string;
    hospitalizacionCSV?: string; 
    medicamentosCSV?: string;
    otrosServiciosCSV?: string;
  }>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const ripsService = new RipsService();
  const { toast } = useToast();


const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) setJsonFile(file);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateRips = async () => {
  
  await sleep(1000);
  setIsProcessing(true);
  setProgress(20);
  // Validar que se haya seleccionado un archivo JSON
  if (!jsonFile || jsonFile.type !== 'application/json') {
    toast({
      title: "Archivo faltante",
      description: "Por favor selecciona el archivo JSON.",
      variant: "destructive"
    });
    return;
  }
  
  await sleep(1000);
  setProgress(50);

  try {
    // Leer el archivo JSON
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const ripsObj: RIPS = JSON.parse(text);

      // Generar los CSV
      const csvs = ripsService.parseJson(ripsObj);
      setCsvFiles(csvs);
    };

    await sleep(1000);
    setProgress(80);

    reader.readAsText(jsonFile);
    setProgress(100);
    setIsProcessing(false);
    
    toast({
      title: "¡Éxito!",
      description: "Los archivos CSV han sido generados correctamente.",
    });
    
  } catch (error) {
    toast({
      title: "Error",
      description: "Ocurrió un error al procesar el archivo JSON.",
      variant: "destructive"
    });
  } finally {
    setIsProcessing(false);
  }
};  

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl shadow-lg">
                <Repeat className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Generador de RIPS JSON a CSV
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramienta profesional para convertir RIPS en formato JSON a CSV formato compatible con EXCEL.
            </p>
          </div>

        <div className="flex gap-4">
          <BackToDashboardButton />
        </div>        

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Cargar Archivo JSON
            </CardTitle>
            <CardDescription>
              Seleccione el archivo JSON a convertir a TXT
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jsonFile">Archivo JSON</Label>
              <Input
                id="jsonFile"
                type="file"
                accept=".json"
                onChange={handleFileChange}
              />
              {jsonFile && (
                <p className="text-sm text-green-600">✓ {jsonFile.name}</p>
              )}
              {/* Botón para ejecutar la conversión */}
              <Button
                className="mt-2 bg-indigo-400 hover:bg-indigo-500 text-white"
                onClick={generateRips}
                disabled={isProcessing || !jsonFile}
              >
                Convertir JSON a CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {isProcessing && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Procesando archivos...</p>
                <Progress value={progress} className="w-full bg-sky-200" />
                <p className="text-xs text-gray-500">{progress}% completado</p>
              </div>
            </CardContent>
          </Card>
        )}


        {!isProcessing && csvFiles.usuariosCSV && (
          <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Descargar Archivos CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mt-4">
                {csvFiles.transaccionCSV && (
                  <Button className='bg-green-500' onClick={() => downloadCSV(csvFiles.transaccionCSV!, "transaccional.csv")}>
                    <Files className="mr-2 h-4 w-4" />
                    Descargar Transacción CSV
                  </Button>
                )}
                {csvFiles.usuariosCSV && (
                  <Button className='bg-green-500' onClick={() => downloadCSV(csvFiles.usuariosCSV!, "usuarios.csv")}>
                    <Files className="mr-2 h-4 w-4" />
                    Descargar Usuarios CSV
                  </Button>
                )}
                {csvFiles.consultasCSV && (
                  <Button className='bg-green-500' onClick={() => downloadCSV(csvFiles.consultasCSV!, "consultas.csv")}>
                    <Files className="mr-2 h-4 w-4" />
                    Descargar Consultas CSV
                  </Button>
                )}
                {csvFiles.procedimientosCSV && (
                  <Button className='bg-green-500' onClick={() => downloadCSV(csvFiles.procedimientosCSV!, "procedimientos.csv")}>
                    <Files className="mr-2 h-4 w-4" />
                    Descargar Procedimientos CSV
                  </Button>
                )}
                {csvFiles.urgenciasCSV && (
                  <Button className='bg-green-500' onClick={() => downloadCSV(csvFiles.urgenciasCSV!, "urgencias.csv")}>
                    <Files className="mr-2 h-4 w-4" />
                    Descargar Urgencias CSV
                  </Button>
                )}
                {csvFiles.hospitalizacionCSV && (
                  <Button className='bg-green-500' onClick={() => downloadCSV(csvFiles.hospitalizacionCSV!, "hospitalizacion.csv")}>
                    <Files className="mr-2 h-4 w-4" />
                    Descargar Hospitalizacion CSV
                  </Button>
                )}
                {csvFiles.medicamentosCSV && (
                  <Button className='bg-green-500' onClick={() => downloadCSV(csvFiles.medicamentosCSV!, "medicamentos.csv")}>
                    <Files className="mr-2 h-4 w-4" />
                    Descargar Medicamentos CSV
                  </Button>
                )}
                {csvFiles.otrosServiciosCSV && (
                  <Button className='bg-green-500' onClick={() => downloadCSV(csvFiles.otrosServiciosCSV!, "otrosServicios.csv")}>
                    <Files className="mr-2 h-4 w-4" />
                    Descargar Otros Servicios CSV
                  </Button>
                )}
              </div>
          </CardContent>
          </Card>
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

export default RipsJsonToTXT;
