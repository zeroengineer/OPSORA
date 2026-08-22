import type PDFDocument from "pdfkit";

import { image, widthAtHeight } from "../assets.ts";
import { COLORS } from "../presets.ts";
import type { DocumentFrontmatter, InvoiceData } from "../schema.ts";

type Doc = InstanceType<typeof PDFDocument>;

export interface InvoiceContext {
  doc: Doc;
  pageWidth: number;
  pageHeight: number;
  margins: { top: number; right: number; bottom: number; left: number };
  frontmatter: DocumentFrontmatter;
  invoice: InvoiceData;
}

function formatCurrency(amount: number): string {
  return (
    "₹ " +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export interface InvoiceTotals {
  subtotal: number;
  cgstRate: number;
  sgstRate: number;
  cgst: number;
  sgst: number;
  total: number;
  /** Set when an explicit amount override disagrees with the derived figure. */
  discrepancy: string | null;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Line items, tax and grand total. Derived from the item amounts unless the
 * document supplies explicit `cgstAmount` / `sgstAmount`, in which case those
 * win and any disagreement is reported back to the caller.
 */
export function computeTotals(invoice: InvoiceData): InvoiceTotals {
  const subtotal = round(invoice.items.reduce((sum, item) => sum + item.amount, 0));
  const cgstRate = invoice.tax?.cgst ?? 0;
  const sgstRate = invoice.tax?.sgst ?? 0;

  // Round each component to paise before summing, so the printed lines always
  // add up to the printed total.
  const derivedCgst = round((subtotal * cgstRate) / 100);
  const derivedSgst = round((subtotal * sgstRate) / 100);

  const cgst = invoice.tax?.cgstAmount ?? derivedCgst;
  const sgst = invoice.tax?.sgstAmount ?? derivedSgst;

  const drift = round(cgst - derivedCgst) + round(sgst - derivedSgst);
  const discrepancy =
    drift === 0
      ? null
      : `tax overridden: ${formatCurrency(cgst + sgst)} entered, ` +
        `${formatCurrency(derivedCgst + derivedSgst)} derived from ` +
        `${String(cgstRate + sgstRate)}% of ${formatCurrency(subtotal)} ` +
        `(${drift > 0 ? "+" : ""}${String(round(drift))})`;

  return {
    subtotal,
    cgstRate,
    sgstRate,
    cgst,
    sgst,
    total: round(subtotal + cgst + sgst),
    discrepancy,
  };
}

const COL_RATIOS = [35, 275, 80, 125.28] as const;

export function drawInvoice(ctx: InvoiceContext): void {
  const { doc, pageWidth: PW, pageHeight: PH, margins, invoice, frontmatter } = ctx;
  const { left: ML, right: MR, top: MT, bottom: MB } = margins;
  const CW = PW - ML - MR;

  const logo = image(frontmatter.header?.logo ?? "logo.png");
  const totals = computeTotals(invoice);

  // Columns keep the original proportions at any content width.
  const ratioTotal = COL_RATIOS.reduce((a, b) => a + b, 0);
  const cols = COL_RATIOS.map((r) => (r / ratioTotal) * CW);

  // ── Header ────────────────────────────────────────────────────────────────
  const headerY = MT;
  doc.image(logo, ML, headerY, { height: 26 });

  doc
    .font("ExtraBold")
    .fontSize(22)
    .fillColor(COLORS.ink)
    .text(frontmatter.title ?? "INVOICE", ML, headerY - 4, { align: "right", width: CW });

  const metaY = headerY + 26;
  doc
    .font("SemiBold")
    .fontSize(8.5)
    .fillColor(COLORS.muted)
    .text("INVOICE NO: ", ML, metaY, { align: "right", width: CW - 80 })
    .font("Bold")
    .fillColor(COLORS.ink)
    .text(invoice.number, ML, metaY, { align: "right", width: CW });

  const dateY = metaY + 13;
  doc
    .font("SemiBold")
    .fontSize(8.5)
    .fillColor(COLORS.muted)
    .text("DATE: ", ML, dateY, { align: "right", width: CW - 80 })
    .font("Medium")
    .fillColor(COLORS.ink)
    .text(invoice.date, ML, dateY, { align: "right", width: CW });

  const headerDividerY = dateY + 20;
  rule(doc, ML, PW - MR, headerDividerY, COLORS.rule, 0.5);

  // ── Addresses ─────────────────────────────────────────────────────────────
  const addressY = headerDividerY + 15;
  const colW = CW / 2 - 10;

  doc.font("Bold").fontSize(9.5).fillColor(COLORS.ink).text("BILL TO", ML, addressY);
  doc
    .font("Bold")
    .fontSize(9.5)
    .fillColor(COLORS.body)
    .text(invoice.billTo.name, ML, addressY + 15, { width: colW, lineGap: 1.5 });

  if (invoice.billTo.address) {
    doc
      .font("Regular")
      .fontSize(8.5)
      .fillColor(COLORS.muted)
      .text(invoice.billTo.address, ML, doc.y + 3, { width: colW - 10, lineGap: 1.5 });
  }

  const rightColX = ML + colW + 20;
  const sender = frontmatter.header;
  doc.font("Bold").fontSize(9.5).fillColor(COLORS.ink).text("FROM", rightColX, addressY);
  doc
    .font("Bold")
    .fontSize(9.5)
    .fillColor(COLORS.body)
    .text(sender?.company ?? "", rightColX, addressY + 15, { width: colW });

  if (sender?.lines?.length) {
    doc
      .font("Regular")
      .fontSize(8.5)
      .fillColor(COLORS.muted)
      .text(sender.lines.join("\n"), rightColX, doc.y + 3, { width: colW, lineGap: 1.5 });
  }

  if (sender?.contact?.length) {
    let y = doc.y + 4;
    for (const row of sender.contact) {
      doc
        .font("SemiBold")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text(`${row.label}: `, rightColX, y, { continued: true })
        .font("Medium")
        .fillColor(COLORS.body)
        .text(row.value);
      y = doc.y + 2;
    }
  }

  const addressDividerY = Math.max(doc.y + 20, addressY + 95);
  rule(doc, ML, PW - MR, addressDividerY, COLORS.rule, 0.5);

  // ── Line items ────────────────────────────────────────────────────────────
  const tableY = addressDividerY + 15;
  const HEAD_H = 22;
  const CELL_PAD_Y = 12;
  const DESC_INSET = 15;

  doc.rect(ML, tableY, CW, HEAD_H).fill(COLORS.ink);

  let x = ML;
  doc.font("Bold").fontSize(8.5).fillColor(COLORS.white);
  doc.text("S.NO", x + 8, tableY + 7, { width: cols[0]! - 8 });
  x += cols[0]!;
  doc.text("DESCRIPTION", x, tableY + 7, { width: cols[1]! });
  x += cols[1]!;
  doc.text("HSN/SAC", x, tableY + 7, { align: "center", width: cols[2]! });
  x += cols[2]!;
  doc.text("AMOUNT", x, tableY + 7, { align: "right", width: cols[3]! - 8 });

  let rowY = tableY + HEAD_H;

  invoice.items.forEach((item, index) => {
    /*
     * Measured, not hardcoded. The original scripts carried a `rowHeight`
     * constant retuned by hand per invoice (105 / 70 / 44) because the
     * description length varies — the single most common reason to edit one.
     */
    doc.font("Medium").fontSize(8.5);
    const descHeight = doc.heightOfString(item.description, {
      width: cols[1]! - DESC_INSET,
      lineGap: 1.5,
    });
    const rowHeight = Math.max(44, descHeight + CELL_PAD_Y * 2);

    if (index % 2 === 0) doc.rect(ML, rowY, CW, rowHeight).fill(COLORS.tint);

    let cx = ML;
    doc.font("Medium").fontSize(8.5).fillColor(COLORS.body);
    doc.text(String(index + 1), cx + 8, rowY + CELL_PAD_Y, { width: cols[0]! - 8 });
    cx += cols[0]!;

    doc
      .font("Medium")
      .fillColor(COLORS.ink)
      .text(item.description, cx, rowY + CELL_PAD_Y, {
        width: cols[1]! - DESC_INSET,
        lineGap: 1.5,
      });
    cx += cols[1]!;

    doc
      .font("Regular")
      .fillColor(COLORS.muted)
      .text(item.hsn ?? "", cx, rowY + CELL_PAD_Y, { align: "center", width: cols[2]! });
    cx += cols[2]!;

    doc
      .font("Bold")
      .fillColor(COLORS.ink)
      .text(formatCurrency(item.amount), cx, rowY + CELL_PAD_Y, {
        align: "right",
        width: cols[3]! - 8,
      });

    rowY += rowHeight;
    rule(doc, ML, PW - MR, rowY, COLORS.rule, 0.5);
  });

  // ── Bank details + totals ─────────────────────────────────────────────────
  const summaryY = rowY + 15;
  const summaryColW = 200;

  if (invoice.bank) {
    doc.font("Bold").fontSize(9).fillColor(COLORS.ink).text("BANK DETAILS", ML, summaryY);

    const pairs: [string, string][] = [
      ["Account Name: ", invoice.bank.accountName],
      ["Bank Name: ", invoice.bank.bankName],
      ["Account No: ", invoice.bank.accountNo],
      ["IFSC Code: ", invoice.bank.ifsc],
    ];
    if (invoice.bank.branch) pairs.push(["Branch: ", invoice.bank.branch]);

    let y = summaryY + 15;
    for (const [label, value] of pairs) {
      doc
        .font("SemiBold")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text(label, ML, y, { continued: true })
        .font("Medium")
        .fillColor(COLORS.body)
        .text(value);
      y = doc.y + 2;
    }
  }

  const calcX = PW - MR - summaryColW;
  const CALC_ROW_H = 18;

  function calcRow(label: string, value: string, y: number, bold = false): void {
    const weight = bold ? "Bold" : "Medium";
    doc
      .font(weight)
      .fontSize(8.5)
      .fillColor(COLORS.muted)
      .text(label, calcX, y, { width: summaryColW - 100 });
    doc
      .font(weight)
      .fontSize(8.5)
      .fillColor(COLORS.ink)
      .text(value, calcX, y, { align: "right", width: summaryColW });
  }

  let calcY = summaryY;
  calcRow("Subtotal", formatCurrency(totals.subtotal), calcY);

  if (invoice.tax) {
    calcY += CALC_ROW_H;
    calcRow(`CGST (${String(totals.cgstRate)}%)`, formatCurrency(totals.cgst), calcY);
    calcY += CALC_ROW_H;
    calcRow(`SGST (${String(totals.sgstRate)}%)`, formatCurrency(totals.sgst), calcY);
  }

  calcY += CALC_ROW_H + 4;
  doc.roundedRect(calcX - 6, calcY - 4, summaryColW + 6, 24, 3).fill(COLORS.ink);
  doc
    .font("Bold")
    .fontSize(9.5)
    .fillColor(COLORS.white)
    .text("Total Invoice", calcX, calcY + 1, { width: summaryColW - 100 });
  doc.text(formatCurrency(totals.total), calcX, calcY + 1, {
    align: "right",
    width: summaryColW - 6,
  });

  // ── Signatory, declaration, thank-you strip ───────────────────────────────
  const footerStartY = Math.max(doc.y + 35, summaryY + 80);

  /*
   * Anything drawn below the text block would make PDFKit auto-insert a page.
   * Dropping the bottom margin for the duration is the original idiom and the
   * reason this all fits on one page.
   */
  const savedBottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;

  rule(doc, ML, PW - MR, footerStartY, COLORS.rule, 0.5);

  const detailsY = footerStartY + 15;
  const signatory = frontmatter.signatory;

  if (signatory) {
    const sigX = PW - MR - 200;
    doc
      .font("Bold")
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(`FOR ${(sender?.company ?? "").toUpperCase()}`, sigX, detailsY, {
        align: "right",
        width: 200,
      });

    const SIG_H = 45;
    if (signatory.image) {
      const sig = image(signatory.image);
      doc.image(sig, PW - MR - widthAtHeight(sig, SIG_H), detailsY + 12, { height: SIG_H });
    }

    const nameY = detailsY + 10 + 50;
    doc
      .font("Bold")
      .fontSize(9)
      .fillColor(COLORS.ink)
      .text(signatory.name, sigX, nameY, { align: "right", width: 200 });

    if (signatory.title) {
      doc
        .font("Medium")
        .fontSize(8)
        .fillColor(COLORS.faint)
        .text(signatory.title, sigX, nameY + 12, { align: "right", width: 200 });
    }
  }

  const stripY = PH - MB - 10;
  const declY = stripY - 45;

  if (invoice.declaration) {
    doc.font("Bold").fontSize(8.5).fillColor(COLORS.ink).text("Declaration", ML, declY);
    doc
      .font("Regular")
      .fontSize(7.5)
      .fillColor(COLORS.faint)
      .text(invoice.declaration, ML, declY + 12, { width: CW, lineGap: 1.5 });
  }

  rule(doc, ML, PW - MR, stripY - 8, COLORS.ruleFaint, 0.5);
  doc
    .font("Bold")
    .fontSize(8)
    .fillColor(COLORS.subtle)
    .text("THANK YOU FOR YOUR BUSINESS", ML, stripY, { align: "center", width: CW });

  doc.page.margins.bottom = savedBottom;
}

function rule(doc: Doc, x1: number, x2: number, y: number, color: string, width: number): void {
  doc.moveTo(x1, y).lineTo(x2, y).strokeColor(color).lineWidth(width).stroke();
}
