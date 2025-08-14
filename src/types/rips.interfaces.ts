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

export interface Medicamento {
  numDocIdPaciente?: string;
  codPrestador: string;
  numAutorizacion: null | string;
  idMIPRES: null | string;
  fechaDispensAdmon: string;
  codDiagnosticoPrincipal: string;
  codDiagnosticoRelacionado: null | string;
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
  vrServicio: number;
  conceptoRecaudo: string;
  valorPagoModerador: number;
  numFEVPagoModerador: null | string;
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
  vrServicio: number;
  conceptoRecaudo: string;
  valorPagoModerador: number;
  numFEVPagoModerador: null | string;
  consecutivo: number;
}

export interface Hospitalizacion {
  numDocIdPaciente?: string;
  codPrestador: string;
  viaIngresoServicioSalud: string;
  fechaInicioAtencion: string;
  numAutorizacion: null | string;
  causaMotivoAtencion: null | string;
  codDiagnosticoPrincipal: string;
  codDiagnosticoPrincipalE: string;
  codDiagnosticoRelacionadoE1: null | string;
  codDiagnosticoRelacionadoE2: null | string;
  codDiagnosticoRelacionadoE3: null | string;
  codComplicacion: null | string;
  condicionDestinoUsuarioEgreso: null | string;
  codDiagnosticoCausaMuerte: null | string;
  fechaEgreso: string;
  consecutivo: number;
  [key: string]: any; // Para permitir acceso dinámico a propiedades
}

export interface Urgencia {
  numDocIdPaciente?: string;
  codPrestador: string;
  fechaInicioAtencion: string;
  causaMotivoAtencion: null | string;
  codDiagnosticoPrincipal: string;
  codDiagnosticoPrincipalE: string;
  codDiagnosticoRelacionadoE1: null | string;
  codDiagnosticoRelacionadoE2: null | string;
  codDiagnosticoRelacionadoE3: null | string;
  condicionDestinoUsuarioEgreso: null | string;
  codDiagnosticoCausaMuerte: null | string;
  fechaEgreso: string;
  consecutivo: number;
  [key: string]: any; // Para permitir acceso dinámico a propiedades
}
