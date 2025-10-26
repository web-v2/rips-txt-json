// Data extraction utilities for XML invoices
import type { InvoiceData } from "./xmlParser";

// Helper function to safely get text content from XML nodes
export const getTextContent = (
  node: Element | null,
  selector: string
): string => {
  if (!node) return "";
  const element = node.querySelector(selector);
  return element?.textContent?.trim() || "";
};

// Helper function to get attribute value
export const getAttributeValue = (
  node: Element | null,
  selector: string,
  attribute: string
): string => {
  if (!node) return "";
  const element = node.querySelector(selector);
  return element?.getAttribute(attribute)?.trim() || "";
};

// Helper function to extract value from CustomTagGeneral and AdditionalInformation
export const getCustomTagValue = (document: Element, name: string): string => {
  // First try the new nested structure: CustomTagGeneral > Interoperabilidad > Group > Collection > AdditionalInformation
  const interoperabilidadElements = document.querySelectorAll(
    "CustomTagGeneral Interoperabilidad Group Collection AdditionalInformation"
  );

  for (const info of interoperabilidadElements) {
    const nameElement = info.querySelector("Name");
    const valueElement = info.querySelector("Value");
    const nameText = nameElement?.textContent?.trim();
    const valueText = valueElement?.textContent?.trim();

    if (nameText === name) {
      return valueText || "";
    }
  }

  // Also try direct AdditionalInformation as fallback
  let additionalInfos = document.querySelectorAll("AdditionalInformation");

  for (const info of Array.from(additionalInfos)) {
    const nameElement = info.querySelector("Name");
    const valueElement = info.querySelector("Value");
    const nameText = nameElement?.textContent?.trim();
    const valueText = valueElement?.textContent?.trim();

    if (nameText === name) {
      return valueText || "";
    }
  }

  // Namespace-agnostic fallback using getElementsByTagNameNS
  const additionalInfosNS = (document as any).getElementsByTagNameNS
    ? document.getElementsByTagNameNS("*", "AdditionalInformation")
    : ([] as any);
  for (const info of Array.from(additionalInfosNS as any)) {
    const nameElement =
      (info as Element).getElementsByTagName("Name")[0] ||
      (info as Element).getElementsByTagNameNS("*", "Name")[0];
    const valueElement =
      (info as Element).getElementsByTagName("Value")[0] ||
      (info as Element).getElementsByTagNameNS("*", "Value")[0];
    const nameText = nameElement?.textContent?.trim();
    const valueText = valueElement?.textContent?.trim();
    if (nameText === name) {
      return valueText || "";
    }
  }

  // Also try the old CustomTagGeneral structure as fallback
  const customTags = document.querySelectorAll("CustomTagGeneral");
  for (const tag of customTags) {
    const nameElement = tag.querySelector("Name");
    const valueElement = tag.querySelector("Value");
    if (nameElement?.textContent?.trim() === name) {
      return valueElement?.textContent?.trim() || "";
    }
  }

  return "";
};

// Helper function to extract CustomField values
export const getCustomFieldValue = (
  document: Element,
  name: string
): string => {
  const customFields = document.querySelectorAll("CustomField");
  for (const field of customFields) {
    if (field.getAttribute("Name") === name) {
      return field.getAttribute("Value") || "";
    }
  }
  return "";
};

// Extract basic invoice information
export const extractBasicInfo = (invoiceElement: Element) => {
  // Check if this is an AttachedDocument being treated as an invoice
  const isAttachedDoc = (invoiceElement as any).__isDirectInvoice;

  // First try to get invoice number from ParentDocumentID
  let invoiceNumber = "";
  const attachedDocument = (invoiceElement as any).__attachedDocument;

  // If we have an attached document reference, get ParentDocumentID from it
  if (attachedDocument) {
    invoiceNumber = getTextContent(
      attachedDocument,
      'cbc\\:ParentDocumentID, ParentDocumentID, [localName="ParentDocumentID"]'
    );
  }

  // If this is a direct AttachedDocument (fallback case), get ParentDocumentID from it
  if (!invoiceNumber && isAttachedDoc) {
    invoiceNumber = getTextContent(
      invoiceElement,
      'cbc\\:ParentDocumentID, ParentDocumentID, [localName="ParentDocumentID"]'
    );
  }

  if (isAttachedDoc) {
    const cufe = getTextContent(
      invoiceElement,
      'cbc\\:UUID, UUID, [localName="UUID"]'
    );
    const invoiceNumberAttached = getTextContent(
      invoiceElement,
      'cbc\\:ParentDocumentID, ParentDocumentID, [localName="ParentDocumentID"]'
    );
    const issueDate = getTextContent(
      invoiceElement,
      'cbc\\:IssueDate, IssueDate, [localName="IssueDate"]'
    );
    const nit = getTextContent(
      invoiceElement,
      'cac\\:SenderParty cac\\:PartyTaxScheme cbc\\:CompanyID, SenderParty PartyTaxScheme CompanyID, [localName="CompanyID"]'
    );

    return {
      cufe,
      invoiceNumber: invoiceNumberAttached || invoiceNumber,
      issueDate,
      nit,
    };
  }

  const cufe =
    getTextContent(invoiceElement, 'cbc\\:UUID, UUID, [localName="UUID"]') ||
    getTextContent(invoiceElement, "CUFE") ||
    getAttributeValue(invoiceElement, "*", "CUFE");

  // If we already have invoice number from ParentDocumentID, use it, otherwise try other sources
  if (!invoiceNumber) {
    // Try to get invoice number from ID field first, then build from prefix + consecutive
    invoiceNumber =
      getTextContent(invoiceElement, 'cbc\\:ID, ID, [localName="ID"]') ||
      getTextContent(invoiceElement, "NumeroFactura, NUMERO_FACTURA");
  }

  // If no direct invoice number, try to build it from CustomField data
  if (!invoiceNumber) {
    const prefijo = getCustomFieldValue(invoiceElement, "Prefijo");
    const consecutivo =
      getTextContent(invoiceElement, 'cbc\\:ID, ID, [localName="ID"]') || "";
    if (prefijo && consecutivo) {
      invoiceNumber = prefijo + consecutivo;
    } else if (prefijo) {
      // Try to find consecutive number in other places
      const possibleConsecutive = consecutivo.replace(/^[A-Z]+/, ""); // Remove prefix letters
      invoiceNumber = prefijo + possibleConsecutive;
    }
  }

  const issueDate =
    getTextContent(
      invoiceElement,
      'cbc\\:IssueDate, IssueDate, [localName="IssueDate"]'
    ) || getTextContent(invoiceElement, "FechaFactura, FECHA_FACTURA");

  // Supplier information
  const supplierParty = invoiceElement.querySelector(
    'cac\\:AccountingSupplierParty, AccountingSupplierParty, [localName="AccountingSupplierParty"]'
  );

  const nit =
    getTextContent(
      supplierParty,
      'cac\\:Party cac\\:PartyTaxScheme cbc\\:CompanyID, Party PartyTaxScheme CompanyID, [localName="CompanyID"]'
    ) ||
    getTextContent(
      supplierParty,
      'cac\\:Party cbc\\:CompanyID, Party CompanyID, [localName="CompanyID"]'
    ) ||
    getTextContent(invoiceElement, "NIT, Nit");

  return { cufe, invoiceNumber, issueDate, nit };
};

// Extract health sector specific data
export const extractHealthSectorData = (document: Element) => {
  // Check if we need to search in the attached document or the invoice itself
  let searchDocument: Element = document;

  // If this is an attached document, the health data might be inside the embedded invoice (often inside CDATA)
  if (document.tagName === "AttachedDocument") {
    // 1) Try to find a real embedded <Invoice> element first
    const embeddedInvoice = document.querySelector("Invoice");
    if (embeddedInvoice) {
      searchDocument = embeddedInvoice as Element;
    } else {
      // 2) Fallback: parse CDATA content inside any <Description> nodes to get the embedded <Invoice>
      const descriptions = document.querySelectorAll(
        "cbc\\:Description, Description"
      );
      for (const desc of Array.from(descriptions)) {
        const text = desc.textContent?.trim() || "";
        if (!text || !text.includes("<Invoice")) continue;
        try {
          const parsed = new DOMParser().parseFromString(
            text,
            "application/xml"
          );
          const candidate =
            parsed.getElementsByTagName("Invoice")[0] ||
            parsed.getElementsByTagNameNS("*", "Invoice")[0] ||
            (parsed.documentElement?.localName === "Invoice"
              ? (parsed.documentElement as Element)
              : null);
          if (candidate) {
            searchDocument = candidate as Element;
            break;
          }
        } catch (e) {
          // Continue searching if parsing fails
        }
      }
    }
  }

  // Extract invoice period dates
  const invoicePeriod = searchDocument.querySelector(
    'cac\\:InvoicePeriod, InvoicePeriod, [localName="InvoicePeriod"]'
  );
  const fechaIngreso =
    invoicePeriod
      ?.querySelector('cbc\\:StartDate, StartDate, [localName="StartDate"]')
      ?.textContent?.trim() || "";
  const fechaEgreso =
    invoicePeriod
      ?.querySelector('cbc\\:EndDate, EndDate, [localName="EndDate"]')
      ?.textContent?.trim() || "";

  const healthData = {
    codigoPrestador: getCustomTagValue(searchDocument, "CODIGO_PRESTADOR"),
    numeroContrato:
      getCustomTagValue(searchDocument, "NUMERO_CONTRATO") ||
      getCustomFieldValue(searchDocument, "NUMERO_CONTRATO"),
    numeroAutorizacion: getCustomTagValue(
      searchDocument,
      "NUMERO_AUTORIZACION"
    ),
    copago:
      getCustomTagValue(searchDocument, "COPAGO") ||
      getCustomFieldValue(searchDocument, "Copago"),
    cuotaModerador:
      getCustomTagValue(searchDocument, "CUOTA_MODERADORA") ||
      getCustomFieldValue(searchDocument, "CUOTA_MODERADORA"),
    prefijo:
      getCustomTagValue(searchDocument, "PREFIJO") ||
      getCustomFieldValue(searchDocument, "Prefijo") ||
      getTextContent(searchDocument, "sts\\:Prefix, Prefix"),
    fechaIngreso:
      fechaIngreso || getCustomTagValue(searchDocument, "FECHA_INGRESO"),
    fechaEgreso:
      fechaEgreso || getCustomTagValue(searchDocument, "FECHA_EGRESO"),
    modalidadPago: getCustomTagValue(searchDocument, "MODALIDAD_PAGO"),
    tipoDocumentoIdentificacion: getCustomTagValue(
      searchDocument,
      "TIPO_DOCUMENTO_IDENTIFICACION"
    ),
    numeroDocumentoIdentificacion: getCustomTagValue(
      searchDocument,
      "NUMERO_DOCUMENTO_IDENTIFICACION"
    ),
    primerApellido: getCustomTagValue(searchDocument, "PRIMER_APELLIDO"),
    segundoApellido: getCustomTagValue(searchDocument, "SEGUNDO_APELLIDO"),
    primerNombre: getCustomTagValue(searchDocument, "PRIMER_NOMBRE"),
    segundoNombre: getCustomTagValue(searchDocument, "SEGUNDO_NOMBRE"),
    tipoUsuario: getCustomTagValue(searchDocument, "TIPO_USUARIO"),
    modalidadContratacion: getCustomTagValue(
      searchDocument,
      "MODALIDAD_CONTRATACION"
    ),
    coberturaPlanBeneficios: getCustomTagValue(
      searchDocument,
      "COBERTURA_PLAN_BENEFICIOS"
    ),
  };

  return healthData;
};

// Create multiple invoice data records - one per invoice line
export const createMultipleInvoiceData = (
  invoiceElement: Element,
  attachedDocument: Element | undefined,
  basicInfo: any
): InvoiceData[] => {
  const totalAmount = getTextContent(
    invoiceElement,
    'cac\\:LegalMonetaryTotal cbc\\:TaxInclusiveAmount, LegalMonetaryTotal TaxInclusiveAmount, [localName="TaxInclusiveAmount"]'
  );
  const netAmount = getTextContent(
    invoiceElement,
    'cac\\:LegalMonetaryTotal cbc\\:LineExtensionAmount, LegalMonetaryTotal LineExtensionAmount, [localName="LineExtensionAmount"]'
  );

  // Extract all invoice lines
  const invoiceLines = invoiceElement.querySelectorAll(
    'cac\\:InvoiceLine, InvoiceLine, [localName="InvoiceLine"]'
  );

  const invoiceRecords: InvoiceData[] = [];

  if (invoiceLines.length === 0) {
    // Single service invoice - create one record
    invoiceRecords.push({
      NIT: basicInfo.nit || "",
      FECHA_DE_FACTURA: basicInfo.issueDate || "",
      NUMERO_DE_FACTURA: basicInfo.invoiceNumber || "",
      CUFE: basicInfo.cufe || "",
      PREFIJO_DE_LA_FACTURA:
        basicInfo.healthData?.prefijo ||
        getTextContent(invoiceElement, "Prefijo") ||
        "",
      CONSECUTIVO_DE_LA_FACTURA:
        getTextContent(invoiceElement, "Consecutivo") ||
        basicInfo.invoiceNumber?.replace(/^[A-Z]+/, "") ||
        "",
      NUMERO_DE_CONTRATO: basicInfo.healthData?.numeroContrato || "",
      VALOR_BRUTO_FACTURA: totalAmount || "",
      VALOR_NETO_FACTURA: netAmount || "",
      CUOTA_MODERADORA: basicInfo.healthData?.cuotaModerador || "0",
      COPAGO: basicInfo.healthData?.copago || "0",
      FECHA_INGRESO: basicInfo.healthData?.fechaIngreso || "",
      FECHA_EGRESO: basicInfo.healthData?.fechaEgreso || "",
      AUTORIZACION: basicInfo.healthData?.numeroAutorizacion || "",
      CODIGO_DEL_SERVICIO_FACTURADO: "",
      DESCRIPCION_DEL_SERVICIO: "",
      CANTIDAD: "1",
      VALOR_UNITARIO: "",
      VALOR_TOTAL_SERVICIO: netAmount || "",
      VALOR_IVA: "0",
      FECHA_EMISION:
        basicInfo.issueDate || new Date().toISOString().split("T")[0],
      CODIGO_PRESTADOR: basicInfo.healthData?.codigoPrestador || "",
      MODALIDAD_PAGO: basicInfo.healthData?.modalidadPago || "",
      TIPO_DOCUMENTO_IDENTIFICACION:
        basicInfo.healthData?.tipoDocumentoIdentificacion || "",
      NUMERO_DOCUMENTO_IDENTIFICACION:
        basicInfo.healthData?.numeroDocumentoIdentificacion || "",
      PRIMER_APELLIDO: basicInfo.healthData?.primerApellido || "",
      SEGUNDO_APELLIDO: basicInfo.healthData?.segundoApellido || "",
      PRIMER_NOMBRE: basicInfo.healthData?.primerNombre || "",
      SEGUNDO_NOMBRE: basicInfo.healthData?.segundoNombre || "",
      TIPO_USUARIO: basicInfo.healthData?.tipoUsuario || "",
      MODALIDAD_CONTRATACION: basicInfo.healthData?.modalidadContratacion || "",
      COBERTURA_PLAN_BENEFICIOS:
        basicInfo.healthData?.coberturaPlanBeneficios || "",
    });
  } else {
    // Multiple services - create one record per line
    invoiceLines.forEach((line, index) => {
      const lineId =
        line
          .querySelector('cbc\\:ID, ID, [localName="ID"]')
          ?.textContent?.trim() || "";
      const standardId =
        line
          .querySelector(
            'cac\\:Item cac\\:StandardItemIdentification cbc\\:ID, Item StandardItemIdentification ID, [localName="StandardItemIdentification"] [localName="ID"]'
          )
          ?.textContent?.trim() || "";
      const descripcion =
        line
          .querySelector(
            'cac\\:Item cbc\\:Description, Item Description, [localName="Description"]'
          )
          ?.textContent?.trim() || "";
      const cantidad =
        line
          .querySelector(
            'cbc\\:InvoicedQuantity, InvoicedQuantity, [localName="InvoicedQuantity"]'
          )
          ?.textContent?.trim() || "";
      const valorUnitario =
        line
          .querySelector(
            'cac\\:Price cbc\\:PriceAmount, Price PriceAmount, [localName="PriceAmount"]'
          )
          ?.textContent?.trim() || "";
      const valorTotalLinea =
        line
          .querySelector(
            'cbc\\:LineExtensionAmount, LineExtensionAmount, [localName="LineExtensionAmount"]'
          )
          ?.textContent?.trim() || "";

      invoiceRecords.push({
        NIT: basicInfo.nit || "",
        FECHA_DE_FACTURA: basicInfo.issueDate || "",
        NUMERO_DE_FACTURA: basicInfo.invoiceNumber || "",
        CUFE: basicInfo.cufe || "",
        PREFIJO_DE_LA_FACTURA:
          basicInfo.healthData?.prefijo ||
          getTextContent(invoiceElement, "Prefijo") ||
          "",
        CONSECUTIVO_DE_LA_FACTURA:
          getTextContent(invoiceElement, "Consecutivo") ||
          basicInfo.invoiceNumber?.replace(/^[A-Z]+/, "") ||
          "",
        NUMERO_DE_CONTRATO: basicInfo.healthData?.numeroContrato || "",
        VALOR_BRUTO_FACTURA: totalAmount || "",
        VALOR_NETO_FACTURA: netAmount || "",
        CUOTA_MODERADORA: basicInfo.healthData?.cuotaModerador || "0",
        COPAGO: basicInfo.healthData?.copago || "0",
        FECHA_INGRESO: basicInfo.healthData?.fechaIngreso || "",
        FECHA_EGRESO: basicInfo.healthData?.fechaEgreso || "",
        AUTORIZACION: basicInfo.healthData?.numeroAutorizacion || "",
        CODIGO_DEL_SERVICIO_FACTURADO: standardId || lineId,
        DESCRIPCION_DEL_SERVICIO: descripcion,
        CANTIDAD: cantidad,
        VALOR_UNITARIO: valorUnitario,
        VALOR_TOTAL_SERVICIO: valorTotalLinea,
        VALOR_IVA: "0",
        FECHA_EMISION:
          basicInfo.issueDate || new Date().toISOString().split("T")[0],
        CODIGO_PRESTADOR: basicInfo.healthData?.codigoPrestador || "",
        MODALIDAD_PAGO: basicInfo.healthData?.modalidadPago || "",
        TIPO_DOCUMENTO_IDENTIFICACION:
          basicInfo.healthData?.tipoDocumentoIdentificacion || "",
        NUMERO_DOCUMENTO_IDENTIFICACION:
          basicInfo.healthData?.numeroDocumentoIdentificacion || "",
        PRIMER_APELLIDO: basicInfo.healthData?.primerApellido || "",
        SEGUNDO_APELLIDO: basicInfo.healthData?.segundoApellido || "",
        PRIMER_NOMBRE: basicInfo.healthData?.primerNombre || "",
        SEGUNDO_NOMBRE: basicInfo.healthData?.segundoNombre || "",
        TIPO_USUARIO: basicInfo.healthData?.tipoUsuario || "",
        MODALIDAD_CONTRATACION:
          basicInfo.healthData?.modalidadContratacion || "",
        COBERTURA_PLAN_BENEFICIOS:
          basicInfo.healthData?.coberturaPlanBeneficios || "",
      });
    });
  }

  return invoiceRecords;
};
