import { z } from "zod";
import {
  Usuario,
  Servicios,
  Consulta,
  Procedimiento,
} from "../types/rips.interfaces";

export const UsuarioSchema = z.object({
  tipoDocumentoIdentificacion: z.string().min(1),
  numDocumentoIdentificacion: z.string().min(1),
  tipoUsuario: z.string().min(1),
  fechaNacimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "fechaNacimiento no válida",
  }),
  codSexo: z.string(),
  codPaisResidencia: z.string(),
  codMunicipioResidencia: z.string(),
  codZonaTerritorialResidencia: z.string(),
  incapacidad: z.string(),
  codPaisOrigen: z.string(),
  consecutivo: z.number(),
  servicios: z.object({
    consultas: z.array(z.any()),
    procedimientos: z.array(z.any()),
  }),
});
