import {
  RIPS,
  Servicios,
  FileProcessingResult,
  ProcessedData,
} from "@/types/rips.interfaces";

export class RipsProcessor {
  static async processFiles(files: File[]): Promise<{
    results: FileProcessingResult[];
    processedData: ProcessedData;
  }> {
    const results: FileProcessingResult[] = [];
    const consolidatedData: RIPS[] = [];

    for (const file of files) {
      try {
        const fileContent = await this.readFileAsText(file);
        const parsedData = JSON.parse(fileContent) as RIPS;

        // Validar estructura básica
        if (!this.validateRipsStructure(parsedData)) {
          results.push({
            fileName: file.name,
            status: "error",
            message: "Estructura de archivo RIPS inválida",
          });
          continue;
        }

        consolidatedData.push(parsedData);
        results.push({
          fileName: file.name,
          status: "success",
          message: `Procesado exitosamente - ${
            parsedData.usuarios?.length || 0
          } usuarios`,
          data: parsedData,
        });
      } catch (error) {
        results.push({
          fileName: file.name,
          status: "error",
          message: `Error al procesar: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        });
      }
    }

    const processedData = this.generateStatistics(consolidatedData);

    return { results, processedData };
  }

  private static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsText(file);
    });
  }

  private static validateRipsStructure(data: any): data is RIPS {
    return (
      data &&
      typeof data === "object" &&
      typeof data.numDocumentoIdObligado === "string" &&
      typeof data.numFactura === "string" &&
      Array.isArray(data.usuarios)
    );
  }

  private static generateStatistics(consolidatedData: RIPS[]): ProcessedData {
    let totalUsuarios = 0;
    let totalServicios = 0;

    consolidatedData.forEach((rips) => {
      totalUsuarios += rips.usuarios?.length || 0;

      rips.usuarios?.forEach((usuario) => {
        const servicios = usuario.servicios;
        if (servicios) {
          totalServicios += servicios.consultas?.length || 0;
          totalServicios += servicios.procedimientos?.length || 0;
          totalServicios += servicios.hospitalizacion?.length || 0;
          totalServicios += servicios.urgencias?.length || 0;
          totalServicios += servicios.medicamentos?.length || 0;
          totalServicios += servicios.otrosServicios?.length || 0;
        }
      });
    });

    return {
      totalFiles: consolidatedData.length,
      totalFacturas: consolidatedData.length,
      totalUsuarios,
      totalServicios,
      consolidatedData,
    };
  }

  static downloadConsolidatedFile(processedData: ProcessedData): void {
    const jsonString = JSON.stringify(processedData.consolidatedData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `rips-consolidado-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // Métodos para cálculos
  private static calculateTotalVrServicio(rips: RIPS): number {
    let total = 0;
    rips.usuarios.forEach((usuario) => {
      const servicios = usuario.servicios;
      // Suma todos los servicios que tengan vrServicio
      ["consultas", "procedimientos", "medicamentos", "otrosServicios"].forEach(
        (tipo) => {
          const lista = servicios[tipo as keyof Servicios];
          if (Array.isArray(lista)) {
            total += lista.reduce(
              (sum, item) =>
                sum +
                (typeof item.vrServicio === "number" ? item.vrServicio : 0),
              0
            );
          }
        }
      );
    });
    return total;
  }

  static downloadCSVFiles(processedData: ProcessedData): void {
    const timestamp = new Date().toISOString().split("T")[0];

    // 1. Archivo transaccional (encabezados RIPS)
    const transaccionalData = processedData.consolidatedData.map((rips) => ({
      numDocumentoIdObligado: rips.numDocumentoIdObligado,
      numFactura: rips.numFactura,
      tipoNota: rips.tipoNota || "",
      numNota: rips.numNota || "",
      totalFactura: RipsProcessor.calculateTotalVrServicio(rips),
    }));
    this.downloadCSV(transaccionalData, `transaccional-${timestamp}.csv`);

    // 2. Archivo usuarios
    const usuariosData: any[] = [];
    processedData.consolidatedData.forEach((rips) => {
      rips.usuarios.forEach((usuario) => {
        usuariosData.push({
          numIdPaciente: usuario.numDocumentoIdentificacion,
          tipoDocumentoIdentificacion: usuario.tipoDocumentoIdentificacion,
          tipoUsuario: usuario.tipoUsuario,
          fechaNacimiento: usuario.fechaNacimiento,
          codSexo: usuario.codSexo,
          codPaisResidencia: usuario.codPaisResidencia,
          codMunicipioResidencia: usuario.codMunicipioResidencia,
          codZonaTerritorialResidencia: usuario.codZonaTerritorialResidencia,
          incapacidad: usuario.incapacidad,
          codPaisOrigen: usuario.codPaisOrigen,
          consecutivo: usuario.consecutivo,
          numFactura: rips.numFactura,
        });
      });
    });
    this.downloadCSV(usuariosData, `usuarios-${timestamp}.csv`);

    // 3. Archivos de servicios
    this.generateServiceCSV(
      processedData,
      "consultas",
      `consultas-${timestamp}.csv`
    );
    this.generateServiceCSV(
      processedData,
      "procedimientos",
      `procedimientos-${timestamp}.csv`
    );
    this.generateServiceCSV(
      processedData,
      "urgencias",
      `urgencias-${timestamp}.csv`
    );
    this.generateServiceCSV(
      processedData,
      "hospitalizacion",
      `hospitalizacion-${timestamp}.csv`
    );
    this.generateServiceCSV(
      processedData,
      "medicamentos",
      `medicamentos-${timestamp}.csv`
    );
    this.generateServiceCSV(
      processedData,
      "otrosServicios",
      `otrosServicios-${timestamp}.csv`
    );
  }

  private static generateServiceCSV(
    processedData: ProcessedData,
    serviceType: string,
    fileName: string
  ): void {
    const serviceData: any[] = [];

    processedData.consolidatedData.forEach((rips) => {
      rips.usuarios.forEach((usuario) => {
        const servicios = usuario.servicios[serviceType as keyof Servicios];
        if (servicios && Array.isArray(servicios)) {
          servicios.forEach((servicio) => {
            serviceData.push({
              numIdPaciente: usuario.numDocumentoIdentificacion,
              ...servicio,
              numFactura: rips.numFactura,
            });
          });
        }
      });
    });

    if (serviceData.length > 0) {
      this.downloadCSV(serviceData, fileName);
    }
  }

  private static downloadCSV(data: any[], fileName: string): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escapar comillas y envolver en comillas si contiene comas o comillas
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}
