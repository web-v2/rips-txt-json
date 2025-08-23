import React from 'react';
import { CheckCircle, XCircle, Download, FileText, Users, Activity, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileProcessingResult, ProcessedData } from '@/types/rips.interfaces';

interface ProcessingResultsProps {
  results: FileProcessingResult[];
  processedData: ProcessedData | null;
  onDownload: () => void;
  onDownloadCSV: () => void;
  isProcessing: boolean;
}

export const ProcessingResults: React.FC<ProcessingResultsProps> = ({
  results,
  processedData,
  onDownload,
  onDownloadCSV,
  isProcessing,
}) => {
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  if (results.length === 0 && !isProcessing) return null;

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      {processedData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Facturas</p>
                  <p className="text-2xl font-bold">{processedData.totalFacturas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios</p>
                  <p className="text-2xl font-bold">{processedData.totalUsuarios}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Servicios</p>
                  <p className="text-2xl font-bold">{processedData.totalServicios}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-cyan-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Archivos</p>
                  <p className="text-2xl font-bold">{processedData.totalFiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resultados del procesamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resultados del Procesamiento</span>
            {processedData && (
              <div className="flex gap-2">
                <Button onClick={onDownload} className="gap-2 bg-green-500 hover:bg-green-600">
                  <Download className="h-4 w-4" />
                  Descargar JSON
                </Button>
                <Button onClick={onDownloadCSV} variant="outline" className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Descargar CSV
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                {successCount} exitosos
              </Badge>
              {errorCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  {errorCount} errores
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {result.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium">{result.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.message}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={result.status === 'success' ? 'default' : 'destructive'}
                >
                  {result.status === 'success' ? 'Procesado' : 'Error'}
                </Badge>
              </div>
            ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};