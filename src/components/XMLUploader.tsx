import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
}

interface XMLUploaderProps {
  onFilesUpload: (files: File[]) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (id: string) => void;
}

export const XMLUploader: React.FC<XMLUploaderProps> = ({
  onFilesUpload,
  uploadedFiles,
  onRemoveFile,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.name.toLowerCase().endsWith('.xml')
    );
    
    if (files.length > 0) {
      onFilesUpload(files);
    }
  }, [onFilesUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.name.toLowerCase().endsWith('.xml')
    );
    
    if (files.length > 0) {
      onFilesUpload(files);
    }
    
    // Reset input
    e.target.value = '';
  }, [onFilesUpload]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploaded': return 'text-muted-foreground';
      case 'processing': return 'text-primary';
      case 'processed': return 'text-accent';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploaded': return <FileText className="h-5 w-5 text-primary" />;
      case 'processed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <X className="w-4 h-4 text-destructive" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="p-8 shadow-card">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
            dragActive 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border hover:border-primary/50 hover:bg-gradient-subtle"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            Cargar Facturas Electrónicas XML
          </h3>
          <p className="text-muted-foreground mb-4">
            Arrastra y suelta archivos XML aquí, o haz clic para seleccionar
          </p>
          <input
            type="file"
            multiple
            accept=".xml"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <Button variant="outline" asChild className="hover:shadow-elegant transition-all duration-300">
            <label htmlFor="file-upload" className="cursor-pointer">
              Seleccionar Archivos XML
            </label>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Solo archivos .xml • Máximo recomendado: 100 facturas
          </p>
        </div>
      </Card>

      {/* Files List */}
      {uploadedFiles.length > 0 && (
        <Card className="p-6 shadow-card">
          <h4 className="text-lg font-semibold mb-4 text-foreground">
            Archivos Cargados ({uploadedFiles.length})
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle border border-border"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getStatusIcon(uploadedFile.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadedFile.file.size)} • 
                      <span className={cn("ml-1", getStatusColor(uploadedFile.status))}>
                        {uploadedFile.status === 'uploaded' && 'Listo'}
                        {uploadedFile.status === 'processing' && 'Procesando...'}
                        {uploadedFile.status === 'processed' && 'Procesado'}
                        {uploadedFile.status === 'error' && 'Error'}
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(uploadedFile.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};