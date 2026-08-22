import PDFDocument from "pdfkit";

import { FONT_NAMES, font } from "./assets.ts";
import { splitFrontmatter, parseFrontmatter } from "./frontmatter.ts";
import { presetFor, resolveMargins, resolvePageSize } from "./presets.ts";
import { validateFrontmatter } from "./schema.ts";
import { computeTotals, drawInvoice } from "./types/invoice.ts";

/**
 * Pins the page's /Rotate entry to 0.
 *
 * Without it some viewers auto-rotate the page. `@types/pdfkit` does not
 * declare `Rotate` on the page dictionary, so the write is narrowed here
 * rather than casting the document itself.
 */
function disableAutoRotation(doc: InstanceType<typeof PDFDocument>): void {
  (doc.page.dictionary.data as Record<string, unknown>).Rotate = 0;
}

export interface RenderResult {
  pdf: Buffer;
  pages: number;
  /** Non-fatal notes worth showing the author, e.g. tax that does not reconcile. */
  warnings: string[];
}

/**
 * Renders a source document (YAML front-matter + markdown body) to PDF bytes.
 *
 * A fresh PDFDocument per call: PDFKit is stateful and stream-based, so two
 * concurrent renders must never share one. Fonts come from cached Buffers, so
 * the per-render cost is registration rather than disk I/O.
 */
export async function renderDocument(source: string): Promise<RenderResult> {
  const split = splitFrontmatter(source);
  const frontmatter = validateFrontmatter(parseFrontmatter(split.frontmatter));

  const preset = presetFor(frontmatter);
  const size = resolvePageSize(frontmatter);
  const margins = resolveMargins(preset, frontmatter);

  const doc = new PDFDocument({
    size: [size.width, size.height],
    margins,
    bufferPages: true,
    autoFirstPage: false,
  });

  for (const name of FONT_NAMES) doc.registerFont(name, font(name));

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<void>((resolve, reject) => {
    doc.on("end", () => { resolve(); });
    doc.on("error", reject);
  });

  doc.on("pageAdded", () => {
    disableAutoRotation(doc);
  });

  doc.addPage();

  const warnings: string[] = [];

  if (frontmatter.invoice) {
    const totals = computeTotals(frontmatter.invoice);
    if (totals.discrepancy) warnings.push(totals.discrepancy);

    drawInvoice({
      doc,
      pageWidth: size.width,
      pageHeight: size.height,
      margins,
      frontmatter,
      invoice: frontmatter.invoice,
    });
  } else {
    throw new Error(
      "Nothing to render: this document has no `invoice:` block, and the " +
        "markdown body renderer is not wired up yet.",
    );
  }

  const pages = doc.bufferedPageRange().count;

  doc.flushPages();
  doc.end();
  await finished;

  return { pdf: Buffer.concat(chunks), pages, warnings };
}
