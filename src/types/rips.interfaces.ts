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
  consecutivo: number;
  servicios: Servicios;
}

export interface Servicios {
  consultas?: Consulta[];
  procedimientos?: Procedimiento[];
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
  codDiagnosticoRelacionado1: null | string;
  codDiagnosticoRelacionado2: null | string;
  codDiagnosticoRelacionado3: null | string;
  tipoDiagnosticoPrincipal: string;
  tipoDocumentoIdentificacion: TipoDocumentoIdentificacion;
  numDocumentoIdentificacion: string;
  vrServicio: number;
  conceptoRecaudo: string;
  valorPagoModerador: number;
  numFEVPagoModerador: null | string;
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
  codDiagnosticoRelacionado: null | string;
  codComplicacion: null | string;
  vrServicio: number;
  conceptoRecaudo: string;
  valorPagoModerador: number;
  numFEVPagoModerador: null | string;
  consecutivo: number;
}
