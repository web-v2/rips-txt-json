import {
  RIPS,
  Usuario,
  Consulta,
  Procedimiento,
  Urgencia,
  Hospitalizacion,
  Medicamento,
  OtrosServicio,
} from "../types/rips.interfaces";
export class RipsService {
  private cambiarFormatoFecha(fecha: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return fecha;
    }
    const partes = fecha.split("/");
    const dia = partes[0].padStart(2, "0");
    const mes = partes[1].padStart(2, "0");
    const anio = partes[2];
    return `${anio}-${mes}-${dia}`;
  }

  private cambiarFormatoFechaConHora(fechaConHora: string): string {
    if (/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?$/.test(fechaConHora)) {
      return fechaConHora;
    }
    let partes = fechaConHora.split(" ");
    let fecha = partes[0].split("/");
    let hora = partes.length > 1 ? partes[1] : "00:00";
    let nuevaFecha = `${fecha[2]}-${fecha[1]}-${fecha[0]} ${hora}`;
    return nuevaFecha;
  }

  public parseJson(rips: RIPS): {
    transaccionCSV: string;
    usuariosCSV: string;
    consultasCSV?: string;
    procedimientosCSV?: string;
    urgenciasCSV?: string;
    hospitalizacionCSV?: string;
    medicamentosCSV?: string;
    otrosServiciosCSV?: string;
  } {
    const transaccionHeaders = [
      "numDocumentoIdObligado",
      "numFactura",
      "tipoNota",
      "numNota",
    ];
    const transaccionValues = [
      rips.numDocumentoIdObligado,
      rips.numFactura,
      rips.tipoNota ?? "",
      rips.numNota ?? "",
    ];
    const transaccionCSV = transaccionHeaders
      .map((header, idx) => `${header},${transaccionValues[idx]}`)
      .join("\n");

    if (rips.usuarios.length === 0) {
      return {
        transaccionCSV,
        usuariosCSV: "",
        consultasCSV: "",
        procedimientosCSV: "",
      };
    }

    // Usuarios
    const usuariosHeaders = [
      "tipoDocumentoIdentificacion",
      "numDocumentoIdentificacion",
      "tipoUsuario",
      "fechaNacimiento",
      "codSexo",
      "codPaisResidencia",
      "codMunicipioResidencia",
      "codZonaTerritorialResidencia",
      "incapacidad",
      "codPaisOrigen",
      "consecutivo",
    ];
    const usuariosCSV = [
      usuariosHeaders.join(","),
      ...rips.usuarios.map((u) =>
        usuariosHeaders.map((h) => u[h] ?? "").join(",")
      ),
    ].join("\n");

    // Consultas
    const consultasHeaders = [
      "numDocIdPaciente",
      "codPrestador",
      "fechaInicioAtencion",
      "numAutorizacion",
      "codConsulta",
      "modalidadGrupoServicioTecSal",
      "grupoServicios",
      "codServicio",
      "finalidadTecnologiaSalud",
      "causaMotivoAtencion",
      "codDiagnosticoPrincipal",
      "codDiagnosticoRelacionado1",
      "codDiagnosticoRelacionado2",
      "codDiagnosticoRelacionado3",
      "tipoDiagnosticoPrincipal",
      "tipoDocumentoIdentificacion",
      "numDocumentoIdentificacion",
      "vrServicio",
      "conceptoRecaudo",
      "valorPagoModerador",
      "numFEVPagoModerador",
      "consecutivo",
    ];

    const consultasRows = rips.usuarios.flatMap((u) =>
      (u.servicios.consultas ?? []).map((p) =>
        consultasHeaders
          .map((h) =>
            h === "numDocIdPaciente" ? u.numDocumentoIdentificacion : p[h] ?? ""
          )
          .join(",")
      )
    );

    const consultasCSV =
      consultasRows.length > 0
        ? [consultasHeaders.join(","), ...consultasRows].join("\n")
        : null;

    // Procedimientos
    const procedimientosHeaders = [
      "numDocIdPaciente",
      "codPrestador",
      "fechaInicioAtencion",
      "idMIPRES",
      "numAutorizacion",
      "codProcedimiento",
      "viaIngresoServicioSalud",
      "modalidadGrupoServicioTecSal",
      "grupoServicios",
      "codServicio",
      "finalidadTecnologiaSalud",
      "tipoDocumentoIdentificacion",
      "numDocumentoIdentificacion",
      "codDiagnosticoPrincipal",
      "codDiagnosticoRelacionado",
      "codComplicacion",
      "vrServicio",
      "conceptoRecaudo",
      "valorPagoModerador",
      "numFEVPagoModerador",
      "consecutivo",
    ];

    const procedimientosRows = rips.usuarios.flatMap((u) =>
      (u.servicios.procedimientos ?? []).map((p) =>
        procedimientosHeaders
          .map((h) =>
            h === "numDocIdPaciente" ? u.numDocumentoIdentificacion : p[h] ?? ""
          )
          .join(",")
      )
    );

    const procedimientosCSV =
      procedimientosRows.length > 0
        ? [procedimientosHeaders.join(","), ...procedimientosRows].join("\n")
        : null;

    // Urgencias
    const urgenciasHeaders = [
      "numDocIdPaciente",
      "codPrestador",
      "fechaInicioAtencion",
      "causaMotivoAtencion",
      "codDiagnosticoPrincipal",
      "codDiagnosticoPrincipalE",
      "codDiagnosticoRelacionadoE1",
      "codDiagnosticoRelacionadoE2",
      "codDiagnosticoRelacionadoE3",
      "condicionDestinoUsuarioEgreso",
      "codDiagnosticoCausaMuerte",
      "fechaEgreso",
      "consecutivo",
    ];

    const urgenciasRows = rips.usuarios.flatMap((u) =>
      (u.servicios.urgencias ?? []).map((urg) =>
        urgenciasHeaders
          .map((h) =>
            h === "numDocIdPaciente"
              ? u.numDocumentoIdentificacion
              : urg[h] ?? ""
          )
          .join(",")
      )
    );

    const urgenciasCSV =
      urgenciasRows.length > 0
        ? [urgenciasHeaders.join(","), ...urgenciasRows].join("\n")
        : null;

    // Hospitalización
    const hospitalizacionHeaders = [
      "numDocIdPaciente",
      "codPrestador",
      "viaIngresoServicioSalud",
      "fechaInicioAtencion",
      "numAutorizacion",
      "causaMotivoAtencion",
      "codDiagnosticoPrincipal",
      "codDiagnosticoPrincipalE",
      "codDiagnosticoRelacionadoE1",
      "codDiagnosticoRelacionadoE2",
      "codDiagnosticoRelacionadoE3",
      "codComplicacion",
      "condicionDestinoUsuarioEgreso",
      "codDiagnosticoCausaMuerte",
      "fechaEgreso",
      "consecutivo",
    ];

    const hospitalizacionRows = rips.usuarios.flatMap((u) =>
      (u.servicios.hospitalizacion ?? []).map((hosp) =>
        hospitalizacionHeaders
          .map((h) =>
            h === "numDocIdPaciente"
              ? u.numDocumentoIdentificacion
              : hosp[h] ?? ""
          )
          .join(",")
      )
    );

    const hospitalizacionCSV =
      hospitalizacionRows.length > 0
        ? [hospitalizacionHeaders.join(","), ...hospitalizacionRows].join("\n")
        : null;

    // Medicamentos
    const medicamentosHeaders = [
      "numDocIdPaciente",
      "codPrestador",
      "numAutorizacion",
      "idMIPRES",
      "fechaDispensAdmon",
      "codDiagnosticoPrincipal",
      "codDiagnosticoRelacionado",
      "tipoMedicamento",
      "codTecnologiaSalud",
      "nomTecnologiaSalud",
      "concentracionMedicamento",
      "unidadMedida",
      "formaFarmaceutica",
      "unidadMinDispensa",
      "cantidadMedicamento",
      "diasTratamiento",
      "tipoDocumentoIdentificacion",
      "numDocumentoIdentificacion",
      "vrUnitMedicamento",
      "vrServicio",
      "conceptoRecaudo",
      "valorPagoModerador",
      "numFEVPagoModerador",
      "consecutivo",
    ];

    const medicamentosRows = rips.usuarios.flatMap((u) =>
      (u.servicios.medicamentos ?? []).map((med) =>
        medicamentosHeaders
          .map((h) =>
            h === "numDocIdPaciente"
              ? u.numDocumentoIdentificacion
              : med[h] ?? ""
          )
          .join(",")
      )
    );

    const medicamentosCSV =
      medicamentosRows.length > 0
        ? [medicamentosHeaders.join(","), ...medicamentosRows].join("\n")
        : null;

    // Otros Servicios
    const otrosServiciosHeaders = [
      "numDocIdPaciente",
      "codPrestador",
      "numAutorizacion",
      "idMIPRES",
      "fechaSuministroTecnologia",
      "tipoOS",
      "codTecnologiaSalud",
      "nomTecnologiaSalud",
      "cantidadOS",
      "tipoDocumentoIdentificacion",
      "numDocumentoIdentificacion",
      "vrUnitOS",
      "vrServicio",
      "conceptoRecaudo",
      "valorPagoModerador",
      "numFEVPagoModerador",
      "consecutivo",
    ];

    const otrosServiciosRows = rips.usuarios.flatMap((u) =>
      (u.servicios.otrosServicios ?? []).map((otr) =>
        otrosServiciosHeaders
          .map((h) =>
            h === "numDocIdPaciente"
              ? u.numDocumentoIdentificacion
              : otr[h] ?? ""
          )
          .join(",")
      )
    );

    const otrosServiciosCSV =
      otrosServiciosRows.length > 0
        ? [otrosServiciosHeaders.join(","), ...otrosServiciosRows].join("\n")
        : null;

    // Al final del método, retorna también los nuevos CSV:
    return {
      transaccionCSV,
      usuariosCSV,
      consultasCSV,
      procedimientosCSV,
      urgenciasCSV,
      hospitalizacionCSV,
      medicamentosCSV,
      otrosServiciosCSV,
    };
  }

  async parseUsuarios(file: File): Promise<Usuario[]> {
    const text = await this.readFileAsText(file);
    const lines = text.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => {
      const valores = line.split(",").map((v) => v.trim());
      if (valores.length !== 11) {
        throw new Error(
          `Cantidad incorrecta de columnas en el archivo de Usuarios, linea: ${
            index + 1
          }`
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
          `Cantidad incorrecta de columnas en el archivo de Consultas, linea: ${
            index + 1
          }`
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
          `Cantidad incorrecta de columnas en el archivo de Procedimientos, linea: ${
            index + 1
          }`
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

  async parseUrgencias(file: File): Promise<Urgencia[]> {
    const text = await this.readFileAsText(file);
    const lines = text.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => {
      const valores = line.split(",");
      if (valores.length !== 13) {
        throw new Error(
          `Cantidad incorrecta de columnas en el archivo de Urgencias, linea: ${
            index + 1
          }`
        );
      }

      const [
        numDocIdPaciente,
        codPrestador,
        fechaInicioAtencionStr,
        causaMotivoAtencion,
        codDiagnosticoPrincipal,
        codDiagnosticoPrincipalE,
        codDiagnosticoRelacionadoE1,
        codDiagnosticoRelacionadoE2,
        codDiagnosticoRelacionadoE3,
        condicionDestinoUsuarioEgreso,
        codDiagnosticoCausaMuerte,
        fechaEgresoStr,
        consecutivoStr,
      ] = line.split(",");

      const consecutivo = parseInt(consecutivoStr) || 0;
      const fechaInicioAtencion = this.cambiarFormatoFechaConHora(
        fechaInicioAtencionStr
      );
      const fechaEgreso = this.cambiarFormatoFechaConHora(fechaEgresoStr);

      return {
        numDocIdPaciente: numDocIdPaciente,
        codPrestador: codPrestador,
        fechaInicioAtencion,
        causaMotivoAtencion: causaMotivoAtencion,
        codDiagnosticoPrincipal: codDiagnosticoPrincipal,
        codDiagnosticoPrincipalE: codDiagnosticoPrincipalE,
        codDiagnosticoRelacionadoE1: codDiagnosticoRelacionadoE1 || null,
        codDiagnosticoRelacionadoE2: codDiagnosticoRelacionadoE2 || null,
        codDiagnosticoRelacionadoE3: codDiagnosticoRelacionadoE3 || null,
        condicionDestinoUsuarioEgreso: condicionDestinoUsuarioEgreso || null,
        codDiagnosticoCausaMuerte: codDiagnosticoCausaMuerte || null,
        fechaEgreso,
        consecutivo,
      } as Urgencia;
    });
  }

  async parseHospitalizacion(file: File): Promise<Hospitalizacion[]> {
    const text = await this.readFileAsText(file);
    const lines = text.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => {
      const valores = line.split(",");
      if (valores.length !== 16) {
        throw new Error(
          `Cantidad incorrecta de columnas en el archivo de Hospitalización, linea: ${
            index + 1
          }`
        );
      }

      const [
        numDocIdPaciente,
        codPrestador,
        viaIngresoServicioSalud,
        fechaInicioAtencionStr,
        numAutorizacion,
        causaMotivoAtencion,
        codDiagnosticoPrincipal,
        codDiagnosticoPrincipalE,
        codDiagnosticoRelacionadoE1,
        codDiagnosticoRelacionadoE2,
        codDiagnosticoRelacionadoE3,
        codComplicacion,
        condicionDestinoUsuarioEgreso,
        codDiagnosticoCausaMuerte,
        fechaEgresoStr,
        consecutivoStr,
      ] = line.split(",");

      const consecutivo = parseInt(consecutivoStr) || 0;
      const fechaInicioAtencion = this.cambiarFormatoFechaConHora(
        fechaInicioAtencionStr
      );
      const fechaEgreso = this.cambiarFormatoFechaConHora(fechaEgresoStr);

      return {
        numDocIdPaciente: numDocIdPaciente,
        codPrestador: codPrestador,
        viaIngresoServicioSalud: viaIngresoServicioSalud,
        fechaInicioAtencion,
        numAutorizacion: numAutorizacion || null,
        causaMotivoAtencion: causaMotivoAtencion,
        codDiagnosticoPrincipal: codDiagnosticoPrincipal,
        codDiagnosticoPrincipalE: codDiagnosticoPrincipalE,
        codDiagnosticoRelacionadoE1: codDiagnosticoRelacionadoE1 || null,
        codDiagnosticoRelacionadoE2: codDiagnosticoRelacionadoE2 || null,
        codDiagnosticoRelacionadoE3: codDiagnosticoRelacionadoE3 || null,
        codComplicacion: codComplicacion || null,
        condicionDestinoUsuarioEgreso: condicionDestinoUsuarioEgreso || null,
        codDiagnosticoCausaMuerte: codDiagnosticoCausaMuerte || null,
        fechaEgreso,
        consecutivo,
      } as Hospitalizacion;
    });
  }

  async parseMedicamentos(file: File): Promise<Medicamento[]> {
    const text = await this.readFileAsText(file);
    const lines = text.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => {
      const valores = line.split(",");
      if (valores.length !== 24) {
        throw new Error(
          `Cantidad incorrecta de columnas en el archivo de Medicamentos, linea: ${
            index + 1
          }`
        );
      }

      const [
        numDocIdPaciente,
        codPrestador,
        numAutorizacion,
        idMIPRES,
        fechaDispensAdmonStr,
        codDiagnosticoPrincipal,
        codDiagnosticoRelacionado,
        tipoMedicamento,
        codTecnologiaSalud,
        nomTecnologiaSalud,
        concentracionMedicamentoStr,
        unidadMedidaStr,
        formaFarmaceutica,
        unidadMinDispensaStr,
        cantidadMedicamentoStr,
        diasTratamientoStr,
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion,
        vrUnitMedicamentoStr,
        vrServicioStr,
        conceptoRecaudo,
        valorPagoModeradorStr,
        numFEVPagoModerador,
        consecutivoStr,
      ] = line.split(",");

      const fechaDispensAdmon =
        this.cambiarFormatoFechaConHora(fechaDispensAdmonStr);
      const concentracionMedicamento =
        parseFloat(concentracionMedicamentoStr) || 0;
      const unidadMedida = parseInt(unidadMedidaStr) || 0;
      const unidadMinDispensa = parseInt(unidadMinDispensaStr) || 0;
      const cantidadMedicamento = parseFloat(cantidadMedicamentoStr) || 0;
      const diasTratamiento = parseInt(diasTratamientoStr) || 0;
      const vrUnitMedicamento = parseFloat(vrUnitMedicamentoStr) || 0;
      const vrServicio = parseFloat(vrServicioStr) || 0;
      const valorPagoModerador = parseFloat(valorPagoModeradorStr) || 0;
      const consecutivo = parseInt(consecutivoStr) || 0;

      return {
        numDocIdPaciente,
        codPrestador,
        numAutorizacion: numAutorizacion || null,
        idMIPRES: idMIPRES || null,
        fechaDispensAdmon,
        codDiagnosticoPrincipal,
        codDiagnosticoRelacionado: codDiagnosticoRelacionado || null,
        tipoMedicamento: tipoMedicamento || null,
        codTecnologiaSalud: codTecnologiaSalud || null,
        nomTecnologiaSalud: nomTecnologiaSalud || null,
        concentracionMedicamento,
        unidadMedida,
        formaFarmaceutica: formaFarmaceutica || null,
        unidadMinDispensa,
        cantidadMedicamento,
        diasTratamiento,
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion: numDocumentoIdentificacion,
        vrUnitMedicamento,
        vrServicio,
        conceptoRecaudo,
        valorPagoModerador,
        numFEVPagoModerador: numFEVPagoModerador || null,
        consecutivo,
      } as Medicamento;
    });
  }

  async parseOtrosServicios(file: File): Promise<OtrosServicio[]> {
    const text = await this.readFileAsText(file);
    const lines = text.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => {
      const valores = line.split(",");

      if (valores.length !== 17) {
        throw new Error(
          `Cantidad incorrecta de columnas en el archivo de Otros servicios, linea: ${
            index + 1
          }`
        );
      }

      const [
        numDocIdPaciente,
        codPrestador,
        numAutorizacion,
        idMIPRES,
        fechaSuministroTecnologiaStr,
        tipoOS,
        codTecnologiaSalud,
        nomTecnologiaSalud,
        cantidadOSStr,
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion,
        vrUnitOSStr,
        vrServicioStr,
        conceptoRecaudo,
        valorPagoModeradorStr,
        numFEVPagoModerador,
        consecutivoStr,
      ] = valores;

      const fechaSuministroTecnologia = this.cambiarFormatoFechaConHora(
        fechaSuministroTecnologiaStr
      );
      const cantidadOS = parseFloat(cantidadOSStr) || 0;
      const vrUnitOS = parseFloat(vrUnitOSStr) || 0;
      const vrServicio = parseFloat(vrServicioStr) || 0;
      const valorPagoModerador = parseFloat(valorPagoModeradorStr) || 0;
      const consecutivo = parseInt(consecutivoStr) || 0;

      return {
        numDocIdPaciente,
        codPrestador,
        numAutorizacion: numAutorizacion || null,
        idMIPRES: idMIPRES || null,
        fechaSuministroTecnologia,
        tipoOS,
        codTecnologiaSalud: codTecnologiaSalud || null,
        nomTecnologiaSalud: nomTecnologiaSalud || null,
        cantidadOS,
        tipoDocumentoIdentificacion,
        numDocumentoIdentificacion: numDocumentoIdentificacion,
        vrUnitOS,
        vrServicio,
        conceptoRecaudo,
        valorPagoModerador,
        numFEVPagoModerador: numFEVPagoModerador || null,
        consecutivo,
      } as OtrosServicio;
    });
  }

  public aggregateDataAll(
    usuarios: Usuario[],
    consultas: Consulta[],
    procedimientos: Procedimiento[],
    urgencias: Urgencia[],
    hospitalizacion: Hospitalizacion[],
    medicamentos: Medicamento[],
    otrosServicios: OtrosServicio[],
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
      //Filtros
      const consultasUsuario = consultas.filter(
        (consulta) =>
          consulta.numDocIdPaciente === usuario.numDocumentoIdentificacion
      );
      const procedimientosUsuario = procedimientos.filter(
        (procedimiento) =>
          procedimiento.numDocIdPaciente === usuario.numDocumentoIdentificacion
      );
      const urgenciaUsuario = urgencias.filter(
        (urgencia) =>
          urgencia.numDocIdPaciente === usuario.numDocumentoIdentificacion
      );
      const hospitalizacionUsuario = hospitalizacion.filter(
        (hosp) => hosp.numDocIdPaciente === usuario.numDocumentoIdentificacion
      );
      const medicamentosUsuario = medicamentos.filter(
        (med) => med.numDocIdPaciente === usuario.numDocumentoIdentificacion
      );
      const otrosServUsuario = otrosServicios.filter(
        (otros) => otros.numDocIdPaciente === usuario.numDocumentoIdentificacion
      );

      //Mapeo de datos
      const ce = consultasUsuario.map(
        ({ numDocIdPaciente, ...resto }) => resto
      );
      const proc = procedimientosUsuario.map(
        ({ numDocIdPaciente, ...resto }) => resto
      );
      const urg = urgenciaUsuario.map(
        ({ numDocIdPaciente, ...resto }) => resto
      );
      const hosp = hospitalizacionUsuario.map(
        ({ numDocIdPaciente, ...resto }) => resto
      );
      const me = medicamentosUsuario.map(
        ({ numDocIdPaciente, ...resto }) => resto
      );
      const otr = otrosServUsuario.map(
        ({ numDocIdPaciente, ...resto }) => resto
      );

      usuario.servicios = {
        consultas: ce.length > 0 ? ce : undefined,
        procedimientos: proc.length > 0 ? proc : undefined,
        urgencias: urg.length > 0 ? urg : undefined,
        hospitalizacion: hosp.length > 0 ? hosp : undefined,
        medicamentos: me.length > 0 ? me : undefined,
        otrosServicios: otr.length > 0 ? otr : undefined,
      };
    });

    rips.usuarios = usuariosCopia;
    return rips;
  }

  public downloadJson(data: any, filename: string): void {
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
