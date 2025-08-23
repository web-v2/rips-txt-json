
  import React, { useState } from 'react';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Alert, AlertDescription } from '@/components/ui/alert';
  import { Progress } from '@/components/ui/progress';
  import { Download, Upload, FileText, Users, Hospital, Stethoscope, Syringe, Microscope, Ambulance, BriefcaseMedical, Package } from 'lucide-react';
  import { RipsService } from '../services/rips.service';
  import { RIPS, Usuario, Medicamento, OtrosServicio, Consulta, Procedimiento, Urgencia, Hospitalizacion } from '../types/rips.interfaces';
  import { useToast } from '@/hooks/use-toast';
  import BackToDashboardButton from './Volver';
  import Footer from './Footer';


  const RipsGeneratorAll = () => {
    const [usuarioFile, setUsuarioFile] = useState<File | null>(null);
    const [consultasFile, setConsultasFile] = useState<File | null>(null);
    const [procedimientosFile, setProcedimientosFile] = useState<File | null>(null);  
    const [urgenciasFile, setUrgenciasFile] = useState<File | null>(null);
    const [hospitalizacionFile, setHospitalizacionFile] = useState<File | null>(null);
    const [medicamentosFile, setMedicamentosFile] = useState<File | null>(null);
    const [otrosServiciosFile, setOtrosServiciosFile] = useState<File | null>(null);

    const [numDocumentoIdObligado, setNumDocumentoIdObligado] = useState('');
    const [numFactura, setNumFactura] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [ripsData, setRipsData] = useState<RIPS | null>(null);
    const [estadisticas, setEstadisticas] = useState<{
      usuarios: number;
      consultas: number;
      procedimientos: number;
      urgencias: number;
      hospitalizaciones: number;
      medicamentos: number;
      otrosServicios: number;
    } | null>(null);

    const ripsService = new RipsService();
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, tipo: 'usuario' | 'consultas' | 'procedimientos' | 'urgencias' | 'hospitalizaciones' | 'medicamentos' | 'otrosServicios') => {
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
          case 'urgencias':
            setUrgenciasFile(file);
            break;
          case 'hospitalizaciones':
            setHospitalizacionFile(file);
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
      if (!usuarioFile) { //|| consultasFile || procedimientosFile || medicamentosFile || otrosServiciosFile
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

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const generateRips = async () => {
      if (!validateFiles()) return;

      setIsProcessing(true);
      setProgress(0);

      try {
        // Parsear archivos
        setProgress(20);
        const usuarios: Usuario[] = await ripsService.parseUsuarios(usuarioFile!);
        
        await sleep(2000);
        setProgress(30);
        const consultas: Consulta[] = consultasFile ? await ripsService.parseConsultas(consultasFile) : [];
        
        await sleep(2000);
        setProgress(40);
        const procedimientos: Procedimiento[] = procedimientosFile ? await ripsService.parseProcedimientos(procedimientosFile) : [];
        
        await sleep(2000);
        setProgress(45);
        const urgencias: Urgencia[] = urgenciasFile ? await ripsService.parseUrgencias(urgenciasFile) : [];

        await sleep(2000);
        setProgress(50);
        const hospitalizaciones: Hospitalizacion[] = hospitalizacionFile ? await ripsService.parseHospitalizacion(hospitalizacionFile) : [];

        await sleep(2000);
        setProgress(55);
        const medicamentos: Medicamento[] = medicamentosFile ? await ripsService.parseMedicamentos(medicamentosFile) : [];
        
        await sleep(2000);
        setProgress(60);
        const otrosServ: OtrosServicio[] = otrosServiciosFile ? await ripsService.parseOtrosServicios(otrosServiciosFile) : [];

        // Agregar datos
        await sleep(2000);
        setProgress(80);
        const rips = ripsService.aggregateDataAll(
          usuarios, 
          consultas, 
          procedimientos, 
          urgencias,
          hospitalizaciones,
          medicamentos, 
          otrosServ, 
          numDocumentoIdObligado.trim(), 
          numFactura.trim()
        );       

        await sleep(2000);
        setProgress(100);        
        setRipsData(rips);
        setEstadisticas({
          usuarios: usuarios.length,
          consultas: consultas.length,
          procedimientos: procedimientos.length,
          urgencias: urgencias.length,
          hospitalizaciones: hospitalizaciones.length,
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
        const filename = `${numFactura}.json`;
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

            {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Generador de RIPS TXT a JSON
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramienta profesional para convertir RIPS en formato TXT para generar el RIPS a JSON, ideal para capita o PGP.              
            </p>
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
                  <Label htmlFor="numDocumentoIdObligado">Número de Documento ID Obligado <span className="text-red-500 font-bold ">(*)</span></Label>
                  <Input
                    id="numDocumentoIdObligado"
                    value={numDocumentoIdObligado}
                    onChange={(e) => setNumDocumentoIdObligado(e.target.value)}
                    placeholder="Ej: 900656493"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numFactura">Número de Factura <span className="text-red-500 font-bold ">(*)</span></Label>
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
                Selecciona los archivos .txt con los datos de usuarios, consultas, procedimientos, medicamentos y otros servicios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usuarioFile" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Archivo de Usuarios <span className="text-red-500 font-bold ">(*)</span>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">             
                <div className="space-y-2">
                  <Label htmlFor="consultasFile" className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
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
                    <Microscope className="h-4 w-4" />
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

                <div className="space-y-2">
                  <Label htmlFor="urgenciasFile" className="flex items-center gap-2">
                    <Ambulance className="h-4 w-4" />
                    Archivo de Urgencias
                  </Label>
                  <Input
                    id="urgenciasFile"
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileChange(e, 'urgencias')}
                  />
                  {urgenciasFile && (
                    <p className="text-sm text-green-600">✓ {urgenciasFile.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalizacionFile" className="flex items-center gap-2">
                    <BriefcaseMedical className="h-4 w-4" />
                    Archivo de Hospitalizacion
                  </Label>
                  <Input
                    id="hospitalizacionFile"
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileChange(e, 'hospitalizaciones')}
                  />
                  {hospitalizacionFile && (
                    <p className="text-sm text-green-600">✓ {hospitalizacionFile.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicamentosFile" className="flex items-center gap-2">
                    <Syringe className="h-4 w-4" />
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
                    <Hospital className="h-4 w-4" />
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
                  <Progress value={progress} className="w-full bg-sky-200" />
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
                <div className="grid grid-cols-1 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{estadisticas.usuarios.toLocaleString("es-ES")}</p>
                    <p className="text-sm text-gray-600">Usuarios</p>
                  </div>                
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">                
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{estadisticas.consultas.toLocaleString("es-ES")}</p>
                    <p className="text-sm text-gray-600">Consultas</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{estadisticas.procedimientos.toLocaleString("es-ES")}</p>
                    <p className="text-sm text-gray-600">Procedimientos</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{estadisticas.medicamentos.toLocaleString("es-ES")}</p>
                    <p className="text-sm text-gray-600">Medicamentos</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">{estadisticas.otrosServicios.toLocaleString("es-ES")}</p>
                    <p className="text-sm text-gray-600">Otros Servicios</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-lime-600">{estadisticas.otrosServicios.toLocaleString("es-ES")}</p>
                    <p className="text-sm text-gray-600">Urgencias</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-cyan-600">{estadisticas.otrosServicios.toLocaleString("es-ES")}</p>
                    <p className="text-sm text-gray-600">Hospitalizaciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">                    
            {!isProcessing ? (
              // Opción 1: Botón deshabilitado sin spinner
              <Button 
                onClick={generateRips} 
                 disabled={isProcessing || !usuarioFile}  
                className="flex-1 h-12 text-lg bg-indigo-400 hover:bg-indigo-500 text-white"
              >
                Generar RIPS
              </Button>
            ) : (
              // Opción 2: Botón activo con spinner y texto dinámico
              <Button 
                onClick={generateRips} 
                disabled={isProcessing}                  
                className="flex-1 h-12 text-lg bg-indigo-500 text-white"
              >
                <svg className="mr-3 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Procesando...
              </Button>
            )}
            
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

  export default RipsGeneratorAll;
