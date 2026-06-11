export type TipoDocumentoIdentificacion =
  | "CC"
  | "TI"
  | "RC"
  | "CE"
  | "PA"
  | "PE"
  | "NV";

export interface RIPS {
  numDocumentoIdObligado: string;
  numFactura: string;
  tipoNota: null | string;
  numNota: null | string;
  usuarios: Usuario[];
}

export interface Usuario {
  tipoDocumentoIdentificacion: TipoDocumentoIdentificacion;
  numDocumentoIdentificacion: string;
  tipoUsuario: string;
  fechaNacimiento: string;
  codSexo: string;
  codPaisResidencia: string;
  codMunicipioResidencia: string;
  codZonaTerritorialResidencia: string;
  incapacidad: string;
  codPaisOrigen: string;
  registroSIRAS?: string;
  consecutivo: number;
  servicios: Servicios;
}

export interface Servicios {
  consultas?: Consulta[];
  procedimientos?: Procedimiento[];
  urgencias?: Urgencia[];
  hospitalizacion?: Hospitalizacion[];
  medicamentos?: Medicamento[];
  otrosServicios?: OtrosServicio[];
}

export interface Consulta {
  numDocIdPaciente?: string;
  codPrestador: string;
  fechaInicioAtencion: string;
  numAutorizacion: null | string;
  codConsulta: string;
  modalidadGrupoServicioTecSal: string;
  grupoServicios: string;
  codServicio: number;
  finalidadTecnologiaSalud: string;
  causaMotivoAtencion: string;
  codDiagnosticoPrincipal: string;
  codDiagnosticoPrincipalCIE11?: null | string;
  nomCodDiagnosticoPrincipalCIE11?: null | string;
  codDiagnosticoRelacionado1: null | string;
  codDiagnosticoRelacionado1CIE11?: null | string;
  nomCodDiagnosticoRelacionado1CIE11?: null | string;
  codDiagnosticoRelacionado2: null | string;
  codDiagnosticoRelacionado2CIE11?: null | string;
  nomCodDiagnosticoRelacionado2CIE11?: null | string;
  codDiagnosticoRelacionado3: null | string;
  codDiagnosticoRelacionado3CIE11?: null | string;
  nomCodDiagnosticoRelacionado3CIE11?: null | string;
  tipoDiagnosticoPrincipal: string;
  tipoDocumentoIdentificacion: TipoDocumentoIdentificacion;
  numDocumentoIdentificacion: string;
  vrServicio: number;
  conceptoRecaudo: string;
  valorPagoModerador: number;
  numFEVPagoModerador: null | string;
  codigoVIDA?: null | string;
  consecutivo: number;
}

export interface Procedimiento {
  numDocIdPaciente?: string;
  codPrestador: string;
  fechaInicioAtencion: string;
  idMIPRES: null | string;
  numAutorizacion: null | string;
  codProcedimiento: string;
  viaIngresoServicioSalud: string;
  modalidadGrupoServicioTecSal: string;
  grupoServicios: string;
  codServicio: number;
  finalidadTecnologiaSalud: string;
  tipoDocumentoIdentificacion: TipoDocumentoIdentificacion;
  numDocumentoIdentificacion: string;
  codDiagnosticoPrincipal: string;
  codDiagnosticoPrincipalCIE11?: null | string;
  nomCodDiagnosticoPrincipalCIE11?: null | string;
  codDiagnosticoRelacionado: null | string;
  codDiagnosticoRelacionadoCIE11?: null | string;
  nomCodDiagnosticoRelacionadoCIE11?: null | string;
  codComplicacion: null | string;
  codComplicacionCIE11?: null | string;
  nomCodComplicacionCIE11?: null | string;
  vrServicio: number;
  conceptoRecaudo: string;
  valorPagoModerador: number;
  numFEVPagoModerador: null | string;
  codigoVIDA?: null | string;
  consecutivo: number;
}

export interface Urgencia {
  numDocIdPaciente?: string;
  codPrestador: string;
  fechaInicioAtencion: string;
  causaMotivoAtencion: null | string;
  codDiagnosticoPrincipal: string;
  codDiagnosticoPrincipalCIE11?: null | string;
  nomCodDiagnosticoPrincipalCIE11?: null | string;
  codDiagnosticoPrincipalE: string;
  codDiagnosticoPrincipalECIE11?: null | string;
  nomCodDiagnosticoPrincipalECIE11?: null | string;
  codDiagnosticoRelacionadoE1: null | string;
  codDiagnosticoRelacionadoE1CIE11?: null | string;
  nomCodDiagnosticoRelacionadoE1CIE11?: null | string;
  codDiagnosticoRelacionadoE2: null | string;
  codDiagnosticoRelacionadoE2CIE11?: null | string;
  nomCodDiagnosticoRelacionadoE2CIE11?: null | string;
  codDiagnosticoRelacionadoE3: null | string;
  codDiagnosticoRelacionadoE3CIE11?: null | string;
  nomCodDiagnosticoRelacionadoE3CIE11?: null | string;
  condicionDestinoUsuarioEgreso: null | string;
  codDiagnosticoCausaMuerte: null | string;
  codDiagnosticoCausaMuerteCIE11?: null | string;
  nomCodDiagnosticoCausaMuerteCIE11?: null | string;
  fechaEgreso: string;
  codigoVIDA?: null | string;
  consecutivo: number;
  [key: string]: any; // Para permitir acceso dinámico a propiedades
}

export interface Hospitalizacion {
  numDocIdPaciente?: string;
  codPrestador: string;
  viaIngresoServicioSalud: string;
  fechaInicioAtencion: string;
  numAutorizacion: null | string;
  causaMotivoAtencion: null | string;
  codDiagnosticoPrincipal: string;
  codDiagnosticoPrincipalCIE11?: null | string;
  nomCodDiagnosticoPrincipalCIE11?: null | string;  
  codDiagnosticoPrincipalE: string;
  codDiagnosticoPrincipalECIE11?: null | string;
  nomCodDiagnosticoPrincipalECIE11?: null | string;
  codDiagnosticoRelacionadoE1: null | string;
  codDiagnosticoRelacionadoE1CIE11?: null | string;
  nomCodDiagnosticoRelacionadoE1CIE11?: null | string;  
  codDiagnosticoRelacionadoE2: null | string;
  codDiagnosticoRelacionadoE2CIE11?: null | string;
  nomCodDiagnosticoRelacionadoE2CIE11?: null | string;
  codDiagnosticoRelacionadoE3: null | string;
  codDiagnosticoRelacionadoE3CIE11?: null | string;
  nomCodDiagnosticoRelacionadoE3CIE11?: null | string;
  codComplicacion: null | string;
  codComplicacionCIE11?: null | string;
  nomCodComplicacionCIE11?: null | string;
  condicionDestinoUsuarioEgreso: null | string;
  codDiagnosticoCausaMuerte: null | string;
  codDiagnosticoCausaMuerteCIE11?: null | string;
  nomCodDiagnosticoCausaMuerteCIE11?: null | string;
  fechaEgreso: string;
  codigoVIDA?: null | string;
  consecutivo: number;
  [key: string]: any; // Para permitir acceso dinámico a propiedades
}

export interface Medicamento {
  numDocIdPaciente?: string;
  codPrestador: string;
  numAutorizacion: null | string;
  idMIPRES: null | string;
  fechaDispensAdmon: string;
  codDiagnosticoPrincipal: string;
  codDiagnosticoPrincipalCIE11?: null | string;
  nomCodDiagnosticoPrincipalCIE11?: null | string;
  codDiagnosticoRelacionado: null | string;
  codDiagnosticoRelacionadoCIE11?: null | string;
  nomCodDiagnosticoRelacionadoCIE11?: null | string;
  tipoMedicamento: null | string;
  codTecnologiaSalud: null | string;
  nomTecnologiaSalud: null | string;
  concentracionMedicamento: number;
  unidadMedida: number;
  formaFarmaceutica: null | string;
  unidadMinDispensa: number;
  cantidadMedicamento: number;
  diasTratamiento: number;
  tipoDocumentoIdentificacion: TipoDocumentoIdentificacion;
  numDocumentoIdentificacion: string;
  vrUnitMedicamento: number;
  vrDispensacion?: number | 0;
  vrServicio: number;
  conceptoRecaudo: string;
  valorPagoModerador: number;
  numFEVPagoModerador: null | string;
  codigoVIDA?: null | string;
  consecutivo: number;
}

export interface OtrosServicio {
  numDocIdPaciente?: string;
  codPrestador: string;
  numAutorizacion: null | string;
  idMIPRES: null | string;
  fechaSuministroTecnologia: string;
  tipoOS: string;
  codTecnologiaSalud: null | string;
  nomTecnologiaSalud: null | string;
  cantidadOS: number;
  tipoDocumentoIdentificacion: TipoDocumentoIdentificacion;
  numDocumentoIdentificacion: string;
  vrUnitOS: number;
  vrDispensacion?: number | 0;
  vrServicio: number;
  conceptoRecaudo: string;
  valorPagoModerador: number;
  numFEVPagoModerador: null | string;
  codigoVIDA?: null | string;
  consecutivo: number;
}

export interface ProcessedData {
  totalFiles: number;
  totalFacturas: number;
  totalUsuarios: number;
  totalServicios: number;
  consolidatedData: RIPS[];
}

export interface FileProcessingResult {
  fileName: string;
  status: "success" | "error";
  message: string;
  data?: RIPS;
}
