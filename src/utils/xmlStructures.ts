// XML structure handlers for different invoice formats
export interface XMLStructureHandler {
  canHandle(xmlDoc: Document): boolean;
  extractInvoices(xmlDoc: Document): Element[];
}

// Handler for AttachedDocument structure with embedded invoice
export class AttachedDocumentHandler implements XMLStructureHandler {
  canHandle(xmlDoc: Document): boolean {
    return !!xmlDoc.querySelector("AttachedDocument");
  }

  extractInvoices(xmlDoc: Document): Element[] {
    const attachedDoc = xmlDoc.querySelector("AttachedDocument");
    if (!attachedDoc) return [];

    // Check if there's a direct invoice in the AttachedDocument
    const directInvoice = attachedDoc.querySelector(
      'Invoice, cac\\:Invoice, [localName="Invoice"]'
    );
    if (directInvoice) {
      (directInvoice as any).__attachedDocument = attachedDoc;
      return [directInvoice];
    }

    // Try different selectors for CDATA content
    const possibleSelectors = [
      "cac\\:Attachment cac\\:ExternalReference cbc\\:Description",
      "cbc\\:Description",
      "Description",
      '[localName="Description"]',
    ];

    let cdataContent = "";

    // Try to find the CDATA content that contains the actual invoice XML
    for (const selector of possibleSelectors) {
      const elements = attachedDoc.querySelectorAll(selector);

      for (const element of elements) {
        const content = element.textContent?.trim() || "";

        // Look for content that starts with XML (Invoice tag)
        if (content.includes("<Invoice") && content.includes("xmlns")) {
          cdataContent = content;
          break;
        }
      }

      if (cdataContent) break;
    }

    if (!cdataContent) {
      return this.tryDirectExtraction(attachedDoc);
    }

    try {
      const parser = new DOMParser();
      const embeddedDoc = parser.parseFromString(cdataContent, "text/xml");

      // Check for parsing errors
      const parseError = embeddedDoc.querySelector("parsererror");
      if (parseError) {
        return this.tryDirectExtraction(attachedDoc);
      }

      const embeddedInvoice = embeddedDoc.querySelector(
        'Invoice, cac\\:Invoice, [localName="Invoice"]'
      );

      if (embeddedInvoice) {
        // Set reference to attached document for health data extraction
        (embeddedInvoice as any).__attachedDocument = attachedDoc;
        return [embeddedInvoice];
      }
    } catch (error) {
      return this.tryDirectExtraction(attachedDoc);
    }

    return [];
  }

  private tryDirectExtraction(attachedDoc: Element): Element[] {
    // Try to extract basic data directly from AttachedDocument structure
    const parentDocId = this.getTextContent(
      attachedDoc,
      'cbc\\:ParentDocumentID, ParentDocumentID, [localName="ParentDocumentID"]'
    );
    const cufe = this.getTextContent(
      attachedDoc,
      'cbc\\:UUID, UUID, [localName="UUID"]'
    );

    if (parentDocId || cufe) {
      // If we have basic invoice data, treat the AttachedDocument as the invoice
      (attachedDoc as any).__isDirectInvoice = true;
      return [attachedDoc];
    }

    return [];
  }

  private getTextContent(node: Element | null, selector: string): string {
    if (!node) return "";
    const element = node.querySelector(selector);
    return element?.textContent?.trim() || "";
  }
}

// Handler for direct Invoice structure
export class DirectInvoiceHandler implements XMLStructureHandler {
  canHandle(xmlDoc: Document): boolean {
    return !!xmlDoc.querySelector(
      'Invoice, fe\\:Invoice, [localName="Invoice"]'
    );
  }

  extractInvoices(xmlDoc: Document): Element[] {
    const invoices: Element[] = [];

    // Check for root invoice
    let invoiceElement = xmlDoc.querySelector(
      'Invoice, fe\\:Invoice, [localName="Invoice"]'
    );
    if (!invoiceElement) {
      invoiceElement = xmlDoc.documentElement;
      if (invoiceElement.localName !== "Invoice") {
        invoiceElement = null;
      }
    }

    if (invoiceElement) {
      invoices.push(invoiceElement);
    }

    // Check for multiple invoices in batch files
    const allInvoices = xmlDoc.querySelectorAll(
      'Invoice, fe\\:Invoice, [localName="Invoice"]'
    );
    allInvoices.forEach((inv) => {
      if (!invoices.includes(inv as Element)) {
        invoices.push(inv as Element);
      }
    });

    return invoices;
  }
}

// Registry of all structure handlers
export const XML_STRUCTURE_HANDLERS: XMLStructureHandler[] = [
  new AttachedDocumentHandler(),
  new DirectInvoiceHandler(),
];
