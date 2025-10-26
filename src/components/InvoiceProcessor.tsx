import React from 'react';
import { Download, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProcessingStats {
  totalFiles: number;
  processedFiles: number;
  totalInvoices: number;
  errorCount: number;
}

interface InvoiceProcessorProps {
  isProcessing: boolean;
  processingProgress: number;
  stats: ProcessingStats;
  onProcess: () => void;
  onDownloadCSV: () => void;
  hasProcessedData: boolean;
}

export const InvoiceProcessor: React.FC<InvoiceProcessorProps> = ({
  isProcessing,
  processingProgress,
  stats,
  onProcess,
  onDownloadCSV,
  hasProcessedData,
}) => {
  return (
    <div className="space-y-6">
      {/* Processing Controls */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Procesamiento de Facturas
            </h3>
            <p className="text-muted-foreground">
              Extraer datos de XML y generar archivo CSV
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={onProcess}
              disabled={isProcessing || stats.totalFiles === 0}
              className="gap-2 shadow-lg bg-indigo-400 hover:bg-indigo-500 text-white transition-all duration-300"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Procesar XML
                </>
              )}
            </Button>                        
          </div>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso del procesamiento</span>
              <span className="text-foreground font-medium">
                {Math.round(processingProgress)}%
              </span>
            </div>
            <Progress value={processingProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Procesando {stats.processedFiles} de {stats.totalFiles} archivos...
            </p>
          </div>
        )}
      </Card>

      {/* Statistics */}
      {(stats.totalFiles > 0 || hasProcessedData) && (
        <Card className="p-6 shadow-card bg-gradient-subtle">
          <h4 className="text-lg font-semibold mb-4 text-foreground">
            Estadísticas del Procesamiento
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats.totalFiles}
              </div>
              <div className="text-sm text-muted-foreground">
                Archivos XML
              </div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-green-500 mb-1">
                {stats.processedFiles}
              </div>
              <div className="text-sm text-muted-foreground">
                Procesados
              </div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-foreground mb-1">
                {stats.totalInvoices}
              </div>
              <div className="text-sm text-muted-foreground">
                Servicios
              </div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-destructive mb-1">
                {stats.errorCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Errores
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* CSV Preview Info */}
      {hasProcessedData && (
        <Card className="p-6 shadow-card">
          <div className="flex items-start space-x-4">
            <FileSpreadsheet className="w-8 h-8 text-green-400 mt-1" />
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Archivo CSV Listo
              </h4>                           

              <p className="text-muted-foreground mb-4">
                Los datos de las facturas han sido extraídos y están listos para descargar. 
                El archivo incluye todos los campos requeridos para el reporte de facturación electrónica.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-muted rounded text-muted-foreground">NIT</span>
                <span className="px-2 py-1 bg-muted rounded text-muted-foreground">FECHA DE FACTURA</span>
                <span className="px-2 py-1 bg-muted rounded text-muted-foreground">NUMERO DE FACTURA</span>
                <span className="px-2 py-1 bg-muted rounded text-muted-foreground">CUFE</span>
                <span className="px-2 py-1 bg-muted rounded text-muted-foreground">VALOR BRUTO</span>
                <span className="px-2 py-1 bg-muted rounded text-muted-foreground">+ 18 campos más</span>
              </div>
            </div>

            <div className="flex space-x-3">  
              <Button
                onClick={onDownloadCSV}
                disabled={!hasProcessedData}
                variant="secondary"
                className="bg-green-500 text-white hover:shadow-elegant transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar CSV
              </Button>
            </div> 

          </div>
        </Card>
      )}
    </div>
  );
};