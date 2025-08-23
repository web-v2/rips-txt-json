import React, { useState } from 'react';
import { Activity, FileText, Loader2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingResults } from '@/components/ProcessingResults';
import { RipsProcessor } from '@/services/ripsProcessor.service';
import { FileProcessingResult, ProcessedData } from '@/types/rips.interfaces';
import BackToDashboardButton from './Volver';
import Footer from './Footer';

const RipsConsolidator = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<FileProcessingResult[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = (newFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Archivos agregados",
      description: `${newFiles.length} archivo(s) JSON agregado(s) correctamente`,
    });
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessFiles = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona al menos un archivo JSON",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingResults([]);
    setProcessedData(null);

    try {
      const { results, processedData } = await RipsProcessor.processFiles(selectedFiles);
      
      setProcessingResults(results);
      setProcessedData(processedData);
      
      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      
      if (successCount > 0) {
        toast({
          title: "Procesamiento completado",
          description: `${successCount} archivo(s) procesado(s) exitosamente${errorCount > 0 ? `, ${errorCount} con errores` : ''}`,
        });
      } else {
        toast({
          title: "Error en el procesamiento",
          description: "No se pudo procesar ningún archivo correctamente",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error durante el procesamiento",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedData) {
      RipsProcessor.downloadConsolidatedFile(processedData);
      toast({
        title: "Descarga iniciada",
        description: "El archivo consolidado se está descargando",
      });
    }
  };

  const handleDownloadCSV = () => {
    if (processedData) {
      RipsProcessor.downloadCSVFiles(processedData);
      toast({
        title: "Descarga CSV iniciada",
        description: "Los archivos CSV se están descargando",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl shadow-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Consolidador RIPS JSON
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Herramienta profesional para consolidar múltiples archivos RIPS JSON en un solo archivo unificado con dos opciones de exportación JSON o CSV.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <BackToDashboardButton />
        </div>
        <br />

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Área de carga de archivos */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Subir Archivos RIPS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFiles}
                onFileRemove={handleFileRemove}
              />
            </CardContent>
          </Card>

          {/* Botón de procesamiento */}
          {selectedFiles.length > 0 && (
            <div className="flex justify-center">                
              <Button
                onClick={handleProcessFiles}
                disabled={isProcessing}
                size="lg"
                className="gap-2 shadow-lg bg-indigo-400 hover:bg-indigo-500 text-white"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Activity className="h-5 w-5" />
                )}
                {isProcessing ? 'Procesando...' : 'Procesar y Consolidar'}
              </Button>
            </div>
          )}

          {/* Resultados */}
          <ProcessingResults
            results={processingResults}
            processedData={processedData}
            onDownload={handleDownload}
            onDownloadCSV={handleDownloadCSV}
            isProcessing={isProcessing}
          />
        </div>
        
        <Card className="shadow-none border-t mt-8 max-w-4xl mx-auto space-y-8">
            <CardContent>
                <Footer />
            </CardContent>
        </Card>         

      </div>
    </div>
  );
};

export default RipsConsolidator;