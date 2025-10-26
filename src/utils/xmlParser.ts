// Parser for Colombian electronic invoices XML
import { XML_STRUCTURE_HANDLERS } from "./xmlStructures";
import {
  extractBasicInfo,
  extractHealthSectorData,
  createMultipleInvoiceData,
} from "./xmlDataExtractor";

export interface InvoiceData {
  NIT: string;
  FECHA_DE_FACTURA: string;
  NUMERO_DE_FACTURA: string;
  CUFE: string;
  PREFIJO_DE_LA_FACTURA: string;
  CONSECUTIVO_DE_LA_FACTURA: string;
  NUMERO_DE_CONTRATO: string;
  VALOR_BRUTO_FACTURA: string;
  VALOR_NETO_FACTURA: string;
  CUOTA_MODERADORA: string;
  COPAGO: string;
  FECHA_INGRESO: string;
  FECHA_EGRESO: string;
  AUTORIZACION: string;
  CODIGO_DEL_SERVICIO_FACTURADO: string;
  DESCRIPCION_DEL_SERVICIO: string;
  CANTIDAD: string;
  VALOR_UNITARIO: string;
  VALOR_TOTAL_SERVICIO: string;
  VALOR_IVA: string;
  FECHA_EMISION: string;
  CODIGO_PRESTADOR: string;
  MODALIDAD_PAGO: string;
  TIPO_DOCUMENTO_IDENTIFICACION: string;
  NUMERO_DOCUMENTO_IDENTIFICACION: string;
  PRIMER_APELLIDO: string;
  SEGUNDO_APELLIDO: string;
  PRIMER_NOMBRE: string;
  SEGUNDO_NOMBRE: string;
  TIPO_USUARIO: string;
  MODALIDAD_CONTRATACION: string;
  COBERTURA_PLAN_BENEFICIOS: string;
}

// Parse single XML invoice file with improved error handling
export const parseXMLInvoice = async (file: File): Promise<InvoiceData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const xmlContent = e.target?.result as string;
        if (!xmlContent || xmlContent.trim() === "") {
          reject(new Error("El archivo XML está vacío"));
          return;
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

        // Check for parsing errors
        const parseError = xmlDoc.querySelector("parsererror");
        if (parseError) {
          reject(new Error(`Error de formato XML: ${parseError.textContent}`));
          return;
        }

        const invoices: InvoiceData[] = [];

        // Try each structure handler until one works
        for (const handler of XML_STRUCTURE_HANDLERS) {
          if (handler.canHandle(xmlDoc)) {
            try {
              const invoiceElements = handler.extractInvoices(xmlDoc);

              for (const invoiceElement of invoiceElements) {
                const attachedDocument = (invoiceElement as any)
                  .__attachedDocument;
                const invoiceRecords = extractInvoiceData(
                  invoiceElement,
                  attachedDocument
                );
                if (invoiceRecords && invoiceRecords.length > 0) {
                  invoices.push(...invoiceRecords);
                }
              }

              if (invoices.length > 0) {
                break; // Found valid invoices, stop trying handlers
              }
            } catch (handlerError) {
              continue; // Try next handler
            }
          }
        }

        if (invoices.length === 0) {
          reject(
            new Error(
              "No se encontraron facturas válidas en el archivo XML. Verifique que el formato sea correcto."
            )
          );
          return;
        }

        resolve(invoices);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        reject(new Error(`Error procesando archivo XML: ${errorMessage}`));
      }
    };

    reader.onerror = () => {
      reject(
        new Error(
          "Error leyendo el archivo. Verifique que sea un archivo válido."
        )
      );
    };

    reader.readAsText(file, "utf-8");
  });
};

// Extract invoice data from XML element with improved error handling
const extractInvoiceData = (
  invoiceElement: Element,
  attachedDocument?: Element
): InvoiceData[] => {
  try {
    if (!invoiceElement) {
      return [];
    }

    // Extract basic information
    const basicInfo = extractBasicInfo(invoiceElement);

    if (!basicInfo.cufe && !basicInfo.invoiceNumber) {
      return [];
    }

    // Extract health sector specific data from attached document if available
    const healthData = extractHealthSectorData(
      attachedDocument || invoiceElement
    );

    // If we have an attached document, try to get invoice number from ParentDocumentID
    if (attachedDocument && !basicInfo.invoiceNumber) {
      const parentDocumentID = attachedDocument
        .querySelector(
          'cbc\\:ParentDocumentID, ParentDocumentID, [localName="ParentDocumentID"]'
        )
        ?.textContent?.trim();
      if (parentDocumentID) {
        basicInfo.invoiceNumber = parentDocumentID;
      }
    }

    // Create invoice records for all lines
    const invoiceRecords = createMultipleInvoiceData(
      invoiceElement,
      attachedDocument,
      {
        ...basicInfo,
        healthData,
      }
    );

    return invoiceRecords;
  } catch (error) {
    return [];
  }
};

// Generate CSV from invoice data
export const generateCSV = (invoices: InvoiceData[]): string => {
  const headers = [
    "NIT",
    "FECHA DE FACTURA",
    "NUMERO DE FACTURA",
    "CUFE",
    "PREFIJO DE LA FACTURA",
    "CONSECUTIVO DE LA FACTURA",
    "NUMERO DE CONTRATO",
    "VALOR BRUTO FACTURA",
    "VALOR NETO FACTURA",
    "CUOTA MODERADORA",
    "COPAGO",
    "FECHA INGRESO",
    "FECHA EGRESO",
    "AUTORIZACION",
    "CODIGO DEL SERVICIO FACTURADO",
    "DESCRIPCION DEL SERVICIO",
    "CANTIDAD",
    "VALOR UNITARIO",
    "VALOR TOTAL SERVICIO",
    "VALOR IVA",
    "FECHA EMISION",
    "CODIGO PRESTADOR",
    "MODALIDAD PAGO",
    "TIPO DOCUMENTO IDENTIFICACION",
    "NUMERO DOCUMENTO IDENTIFICACION",
    "PRIMER APELLIDO",
    "SEGUNDO APELLIDO",
    "PRIMER NOMBRE",
    "SEGUNDO NOMBRE",
    "TIPO USUARIO",
    "MODALIDAD CONTRATACION",
    "COBERTURA PLAN BENEFICIOS",
  ];

  const csvRows = [headers.join(";")];

  invoices.forEach((invoice) => {
    const row = [
      invoice.NIT,
      invoice.FECHA_DE_FACTURA,
      invoice.NUMERO_DE_FACTURA,
      invoice.CUFE,
      invoice.PREFIJO_DE_LA_FACTURA,
      invoice.CONSECUTIVO_DE_LA_FACTURA,
      invoice.NUMERO_DE_CONTRATO,
      invoice.VALOR_BRUTO_FACTURA,
      invoice.VALOR_NETO_FACTURA,
      invoice.CUOTA_MODERADORA,
      invoice.COPAGO,
      invoice.FECHA_INGRESO,
      invoice.FECHA_EGRESO,
      invoice.AUTORIZACION,
      invoice.CODIGO_DEL_SERVICIO_FACTURADO,
      invoice.DESCRIPCION_DEL_SERVICIO,
      invoice.CANTIDAD,
      invoice.VALOR_UNITARIO,
      invoice.VALOR_TOTAL_SERVICIO,
      invoice.VALOR_IVA,
      invoice.FECHA_EMISION,
      invoice.CODIGO_PRESTADOR,
      invoice.MODALIDAD_PAGO,
      invoice.TIPO_DOCUMENTO_IDENTIFICACION,
      invoice.NUMERO_DOCUMENTO_IDENTIFICACION,
      invoice.PRIMER_APELLIDO,
      invoice.SEGUNDO_APELLIDO,
      invoice.PRIMER_NOMBRE,
      invoice.SEGUNDO_NOMBRE,
      invoice.TIPO_USUARIO,
      invoice.MODALIDAD_CONTRATACION,
      invoice.COBERTURA_PLAN_BENEFICIOS,
    ];
    csvRows.push(row.join(";"));
  });

  return csvRows.join("\n");
};

// Download CSV file
export const downloadCSV = (
  csvContent: string,
  filename: string = "facturas_electronicas.csv"
) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
