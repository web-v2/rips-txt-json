import React, { useState, useCallback } from 'react';
import { FileSpreadsheet, Zap, Shield, Clock, FileText, CodeXml } from 'lucide-react';
import { XMLUploader } from '@/components/XMLUploader';
import { InvoiceProcessor } from '@/components/InvoiceProcessor';
import { parseXMLInvoice, generateCSV, downloadCSV, InvoiceData } from '@/utils/xmlParser';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { v4 as uuidv4 } from 'uuid';
import BackToDashboardButton from '@/components/Volver';


interface UploadedFile {
  file: File;
  id: string;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
}

interface ProcessingStats {
  totalFiles: number;
  processedFiles: number;
  totalInvoices: number;
  errorCount: number;
}

const InvoiceApp = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedData, setProcessedData] = useState<InvoiceData[]>([]);
  const [stats, setStats] = useState<ProcessingStats>({
    totalFiles: 0,
    processedFiles: 0,
    totalInvoices: 0,
    errorCount: 0
  });
  
  const { toast } = useToast();

  const makeId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : uuidv4());

  const handleFilesUpload = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      file,
      id: makeId(),
      status: 'uploaded'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setStats(prev => ({
      ...prev,
      totalFiles: prev.totalFiles + newFiles.length
    }));
    
    toast({
      title: "Archivos cargados",
      description: `Se cargaron ${newFiles.length} archivo(s) XML exitosamente.`,
      className: "bg-blue-600 text-white",
    });
  }, [toast]);

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    setStats(prev => ({
      ...prev,
      totalFiles: prev.totalFiles - 1
    }));
  }, []);

  const handleProcess = useCallback(async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    const allInvoices: InvoiceData[] = [];
    let processedCount = 0;
    let errorCount = 0;

    for (const uploadedFile of uploadedFiles) {
      try {
        // Update file status
        setUploadedFiles(prev => 
          prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'processing' } : f)
        );

        const invoices = await parseXMLInvoice(uploadedFile.file);
        allInvoices.push(...invoices);
        
        // Update file status to processed
        setUploadedFiles(prev => 
          prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'processed' } : f)
        );
        
        processedCount++;
      } catch (error) {
        console.error(`Error processing ${uploadedFile.file.name}:`, error);
        
        // Update file status to error
        setUploadedFiles(prev => 
          prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'error' } : f)
        );
        
        errorCount++;
        toast({
          title: "Error procesando archivo",
          description: `Error en ${uploadedFile.file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          variant: "destructive",
        });
      }

      // Update progress
      const progress = ((processedCount + errorCount) / uploadedFiles.length) * 100;
      setProcessingProgress(progress);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        processedFiles: processedCount,
        totalInvoices: allInvoices.length,
        errorCount
      }));
    }

    setProcessedData(allInvoices);
    setIsProcessing(false);
    
    if (allInvoices.length > 0) {
      toast({
        title: "✅ Procesamiento completado",
        description: `Se procesaron ${allInvoices.length} servicios de ${processedCount} facturas.`,
        className: "bg-green-600 text-white",
      });
    }
  }, [uploadedFiles, toast]);

  const handleDownloadCSV = useCallback(() => {
    if (processedData.length === 0) return;

    try {
      const csvContent = generateCSV(processedData);
      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csvContent, `facturas_electronicas_${timestamp}.csv`);
      
      toast({
        title: "Descarga iniciada",
        description: `Se está descargando el archivo CSV con ${processedData.length} registros.`,
      });
    } catch (error) {
      toast({
        title: "Error en la descarga",
        description: "No se pudo generar el archivo CSV. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  }, [processedData, toast]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">          

            {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl shadow-lg">
                <CodeXml className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Procesador de Facturas Electrónicas<br />              
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Convierte archivos XML de facturas electrónicas colombianas en reportes CSV organizados con los campos previamente definidos.
            </p>

            <div className="text-center">                
                <div className="flex flex-wrap justify-center gap-6 text-muted-foreground mt-4">
                    <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Procesamiento rápido</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>100% seguro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Ahorra tiempo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    <span>Formato estándar</span>
                    </div>
                </div>
                </div>
            </div>

          <div className="flex gap-4">
            <BackToDashboardButton />
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. Cargar Archivos XML General
              </CardTitle>
              <CardDescription>
                Selecciona uno o múltiples archivos XML de facturas electrónicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="gap-4">
                <div className="space-y-2">
                  <div className="gap-8">
                    {/* Left Column - Upload */}
                    <div>                        
                        <XMLUploader
                            onFilesUpload={handleFilesUpload}
                            uploadedFiles={uploadedFiles}
                            onRemoveFile={handleRemoveFile}
                        />
                    </div>
                    </div>
                    </div>
                    </div>
            </CardContent>
          </Card>

          {/* Card de procesamiento */}
          {uploadedFiles.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                2. Procesar y Descargar
              </CardTitle>
              <CardDescription>
                Extrae los datos y genera el archivo CSV con todos los campos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="gap-4">
                <div className="space-y-2">
                  <div className="gap-8">                    
        
                    {/* Right Column - Process */}
                    <div>                        
                        <InvoiceProcessor
                            isProcessing={isProcessing}
                            processingProgress={processingProgress}
                            stats={stats}
                            onProcess={handleProcess}
                            onDownloadCSV={handleDownloadCSV}
                            hasProcessedData={processedData.length > 0}
                        />
                    </div>
                </div>
                </div>
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

export default InvoiceApp;