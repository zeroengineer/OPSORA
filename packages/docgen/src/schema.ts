import { z } from "zod";

/**
 * Front-matter contract.
 *
 * Every field is optional: absent front-matter must still render, because the
 * existing document corpus has none. Defaults come from the preset chosen by
 * `type` (see `presets.ts`), not from here — this schema only describes what a
 * document is allowed to *override*.
 */

const marginsSchema = z.object({
  top: z.number().nonnegative().optional(),
  right: z.number().nonnegative().optional(),
  bottom: z.number().nonnegative().optional(),
  left: z.number().nonnegative().optional(),
});

const pageSchema = z.object({
  size: z.enum(["A4", "Letter"]).optional(),
  orientation: z.enum(["portrait", "landscape"]).optional(),
  margins: marginsSchema.optional(),
});

const headerSchema = z.object({
  variant: z.enum(["letterhead", "none"]).optional(),
  company: z.string().optional(),
  /** Address lines, rendered one per line under the company name. */
  lines: z.array(z.string()).optional(),
  logo: z.string().optional(),
  /** Labelled contact rows. Order is preserved as written. */
  contact: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});

const footerSchema = z.object({
  left: z.string().optional(),
  centre: z.string().optional(),
  pageNumbers: z.boolean().optional(),
});

const watermarkSchema = z.object({
  enabled: z.boolean().optional(),
  text: z.string().optional(),
});

/** Per-page suppression. `page` is 1-based, matching what the footer prints. */
const pageOverrideSchema = z.object({
  page: z.number().int().positive(),
  header: z.boolean().optional(),
  footer: z.boolean().optional(),
  watermark: z.boolean().optional(),
});

const partySchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  gstin: z.string().optional(),
});

const invoiceItemSchema = z.object({
  description: z.string(),
  hsn: z.string().optional(),
  amount: z.number(),
});

const invoiceSchema = z.object({
  number: z.string(),
  date: z.string(),
  billTo: partySchema,
  items: z.array(invoiceItemSchema).min(1, "an invoice needs at least one item"),
  /*
   * Rates are percentages and amounts are derived from them by default.
   *
   * `cgstAmount` / `sgstAmount` override the derived figures. That exists for
   * one reason: several historical invoices carry tax that does not reconcile
   * with their line items (ICF is 0.11 out, Athena 0.04), because the figures
   * were back-computed from a gross settlement. Reissuing one of those has to
   * reproduce it exactly, so the override is supported — and `renderDocument`
   * reports the discrepancy rather than hiding it.
   */
  tax: z
    .object({
      cgst: z.number().nonnegative(),
      sgst: z.number().nonnegative(),
      cgstAmount: z.number().nonnegative().optional(),
      sgstAmount: z.number().nonnegative().optional(),
    })
    .optional(),
  bank: z
    .object({
      accountName: z.string(),
      bankName: z.string(),
      accountNo: z.string(),
      ifsc: z.string(),
      branch: z.string().optional(),
    })
    .optional(),
  declaration: z.string().optional(),
});

export const documentSchema = z.object({
  type: z.enum(["invoice", "mou", "proposal", "letterhead"]).optional(),
  title: z.string().optional(),
  page: pageSchema.optional(),
  header: headerSchema.optional(),
  footer: footerSchema.optional(),
  watermark: watermarkSchema.optional(),
  /** Render everything before the first `---` divider as a centred cover. */
  cover: z.boolean().optional(),
  pages: z.array(pageOverrideSchema).optional(),
  signatory: z
    .object({ name: z.string(), title: z.string().optional(), image: z.string().optional() })
    .optional(),
  invoice: invoiceSchema.optional(),
});

export type DocumentFrontmatter = z.infer<typeof documentSchema>;
export type InvoiceData = z.infer<typeof invoiceSchema>;
export type PageOverride = z.infer<typeof pageOverrideSchema>;

/**
 * Validates parsed front-matter, raising a single readable error listing every
 * problem. This text reaches the user in the preview pane, so it is written for
 * them rather than for a stack trace.
 */
export function validateFrontmatter(input: unknown): DocumentFrontmatter {
  const result = documentSchema.safeParse(input);
  if (result.success) return result.data;

  const issues = result.error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return path ? `  - ${path}: ${issue.message}` : `  - ${issue.message}`;
    })
    .join("\n");

  throw new Error(`Front-matter is invalid:\n${issues}`);
}
