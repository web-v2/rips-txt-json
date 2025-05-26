import {
  RIPS,
  Usuario,
  Consulta,
  Procedimiento,
} from "../types/rips.interfaces";
export class RipsService {
  private cambiarFormatoFecha(fecha: string): string {
    let partes = fecha.split("/");
    let nuevaFecha = `${partes[2]}-${partes[1]}-${partes[0]}`;
    return nuevaFecha;
  }

  private cambiarFormatoFechaConHora(fechaConHora: string): string {
    let partes = fechaConHora.split(" ");
    let fecha = partes[0].split("/");
    let hora = partes.length > 1 ? partes[1] : "00:00";

    let nuevaFecha = `${fecha[2]}-${fecha[1]}-${fecha[0]} ${hora}`;
    return nuevaFecha;
  }

  async parseUsuarios(file: File): Promise<Usuario[]> {
    const text = await this.readFileAsText(file);
    const lines = text.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => {
      const valores = line.split(",");
      if (valores.length !== 11) {
        throw new Error(
          `Error en los Usuarios ${index + 1}: cantidad incorrecta de columnas`
        );
      }

      const [
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion,
        tipoUsuario,
        fechaNacimientoA,
        codSexo,
        codPaisResidencia,
        codMunicipioResidencia,
        codZonaTerritorialResidencia,
        incapacidad,
        codPaisOrigen,
        consecutivoStr,
      ] = line.split(",");

      const fechaNacimiento = this.cambiarFormatoFecha(fechaNacimientoA);
      const consecutivo = parseInt(consecutivoStr) || index + 1;

      return {
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion,
        tipoUsuario,
        fechaNacimiento,
        codSexo,
        codPaisResidencia,
        codMunicipioResidencia,
        codZonaTerritorialResidencia,
        incapacidad,
        codPaisOrigen,
        consecutivo,
        servicios: {
          consultas: [],
          procedimientos: [],
        },
      } as Usuario;
    });
  }

  async parseConsultas(file: File): Promise<Consulta[]> {
    const text = await this.readFileAsText(file);
    const lines = text.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => {
      const valores = line.split(",");
      if (valores.length !== 22) {
        throw new Error(
          `Error en las Consultas ${index + 1}: cantidad incorrecta de columnas`
        );
      }

      const [
        numDocIdPaciente,
        codPrestador,
        fechaInicioAtencionA,
        numAutorizacion,
        codConsulta,
        modalidadGrupoServicioTecSal,
        grupoServicios,
        codServicioStr,
        finalidadTecnologiaSalud,
        causaMotivoAtencion,
        codDiagnosticoPrincipal,
        codDiagnosticoRelacionado1,
        codDiagnosticoRelacionado2,
        codDiagnosticoRelacionado3,
        tipoDiagnosticoPrincipal,
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion,
        vrServicioStr,
        conceptoRecaudo,
        valorPagoModeradorStr,
        numFEVPagoModerador,
        consecutivoStr,
      ] = line.split(",");

      const codServicio = parseInt(codServicioStr) || 0;
      const vrServicio = parseFloat(vrServicioStr) || 0;
      const valorPagoModerador = parseFloat(valorPagoModeradorStr) || 0;
      const consecutivo = parseInt(consecutivoStr) || 0;

      const fechaInicioAtencion =
        this.cambiarFormatoFechaConHora(fechaInicioAtencionA);

      return {
        numDocIdPaciente: numDocIdPaciente,
        codPrestador,
        fechaInicioAtencion,
        numAutorizacion: numAutorizacion || null,
        codConsulta,
        modalidadGrupoServicioTecSal,
        grupoServicios,
        codServicio,
        finalidadTecnologiaSalud,
        causaMotivoAtencion,
        codDiagnosticoPrincipal,
        codDiagnosticoRelacionado1: codDiagnosticoRelacionado1 || null,
        codDiagnosticoRelacionado2: codDiagnosticoRelacionado2 || null,
        codDiagnosticoRelacionado3: codDiagnosticoRelacionado3 || null,
        tipoDiagnosticoPrincipal,
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion: numDocumentoIdentificacion,
        vrServicio,
        conceptoRecaudo,
        valorPagoModerador,
        numFEVPagoModerador: numFEVPagoModerador || null,
        consecutivo,
      } as Consulta;
    });
  }

  async parseProcedimientos(file: File): Promise<Procedimiento[]> {
    const text = await this.readFileAsText(file);
    const lines = text.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => {
      const valores = line.split(",");
      if (valores.length !== 21) {
        throw new Error(
          `Error en los Procedimientos ${
            index + 1
          }: cantidad incorrecta de columnas`
        );
      }

      const [
        numDocIdPaciente,
        codPrestador,
        fechaInicioAtencionA,
        idMIPRES,
        numAutorizacion,
        codProcedimiento,
        viaIngresoServicioSalud,
        modalidadGrupoServicioTecSal,
        grupoServicios,
        codServicioStr,
        finalidadTecnologiaSalud,
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion,
        codDiagnosticoPrincipal,
        codDiagnosticoRelacionado,
        codComplicacion,
        vrServicioStr,
        conceptoRecaudo,
        valorPagoModeradorStr,
        numFEVPagoModerador,
        consecutivoStr,
      ] = line.split(",");

      const codServicio = parseInt(codServicioStr) || 0;
      const vrServicio = parseFloat(vrServicioStr) || 0;
      const valorPagoModerador = parseFloat(valorPagoModeradorStr) || 0;
      const consecutivo = parseInt(consecutivoStr) || 0;
      const fechaInicioAtencion =
        this.cambiarFormatoFechaConHora(fechaInicioAtencionA);
      return {
        numDocIdPaciente: numDocIdPaciente,
        codPrestador,
        fechaInicioAtencion,
        idMIPRES: idMIPRES || null,
        numAutorizacion: numAutorizacion || null,
        codProcedimiento,
        viaIngresoServicioSalud,
        modalidadGrupoServicioTecSal,
        grupoServicios,
        codServicio,
        finalidadTecnologiaSalud,
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion: numDocumentoIdentificacion,
        codDiagnosticoPrincipal,
        codDiagnosticoRelacionado: codDiagnosticoRelacionado || null,
        codComplicacion: codComplicacion || null,
        vrServicio,
        conceptoRecaudo,
        valorPagoModerador,
        numFEVPagoModerador: numFEVPagoModerador || null,
        consecutivo,
      } as Procedimiento;
    });
  }

  aggregateData(
    usuarios: Usuario[],
    consultas: Consulta[],
    procedimientos: Procedimiento[],
    numDocumentoIdObligado: string,
    numFactura: string
  ): RIPS {
    // Crear una estructura de RIPS
    const rips: RIPS = {
      numDocumentoIdObligado,
      numFactura,
      tipoNota: null,
      numNota: null,
      usuarios: [],
    };

    // Hacer una copia de los usuarios para no modificar el original
    const usuariosCopia = [...usuarios];

    // Asignar consultas a usuarios
    usuariosCopia.forEach((usuario) => {
      const consultasUsuario = consultas.filter(
        (consulta) =>
          consulta.numDocIdPaciente === usuario.numDocumentoIdentificacion
      );

      const procedimientosUsuario = procedimientos.filter(
        (procedimiento) =>
          procedimiento.numDocIdPaciente === usuario.numDocumentoIdentificacion
      );

      const ce = consultasUsuario.map(
        ({ numDocIdPaciente, ...resto }) => resto
      );

      const proc = procedimientosUsuario.map(
        ({ numDocIdPaciente, ...resto }) => resto
      );

      usuario.servicios = {
        consultas: ce.length > 0 ? ce : undefined,
        procedimientos: proc.length > 0 ? proc : undefined,
      };
    });

    rips.usuarios = usuariosCopia;
    return rips;
  }

  downloadJson(data: any, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
}
