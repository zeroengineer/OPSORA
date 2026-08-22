import type { DocumentFrontmatter } from "./schema.ts";

/** A4 at 72 dpi, in points — the size every existing document uses. */
export const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
} as const;

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Preset {
  margins: Margins;
  /** Draw the letterhead band. When true, `margins.top` IS the band height. */
  letterhead: boolean;
  /** Extra padding below the letterhead before body content starts. */
  contentPadding: number;
  logoHeight: number;
  baseFontSize: number;
  lineGap: number;
  pageNumbers: boolean;
}

/*
 * The three margin regimes the 42 original scripts actually used, kept at
 * their exact values so existing documents keep their current look. Anything
 * a document needs to change, it changes through front-matter.
 */
export const PRESETS: Record<string, Preset> = {
  letterhead: {
    margins: { top: 100, right: 37.5, bottom: 39, left: 37.5 },
    letterhead: true,
    contentPadding: 10,
    logoHeight: 32,
    baseFontSize: 11.5,
    lineGap: 3.5,
    pageNumbers: true,
  },
  proposal: {
    margins: { top: 100, right: 37.5, bottom: 39, left: 37.5 },
    letterhead: true,
    contentPadding: 10,
    logoHeight: 32,
    baseFontSize: 11.5,
    lineGap: 3.5,
    pageNumbers: true,
  },
  mou: {
    margins: { top: 55, right: 45, bottom: 55, left: 45 },
    letterhead: false,
    contentPadding: 0,
    logoHeight: 32,
    baseFontSize: 10.5,
    lineGap: 6,
    pageNumbers: true,
  },
  invoice: {
    margins: { top: 40, right: 40, bottom: 40, left: 40 },
    letterhead: false,
    contentPadding: 0,
    logoHeight: 26,
    baseFontSize: 8.5,
    lineGap: 1.5,
    pageNumbers: false,
  },
};

/** One colour scale, replacing the two that had drifted apart. */
export const COLORS = {
  ink: "#1a1a1a",
  body: "#333333",
  muted: "#555555",
  faint: "#666666",
  subtle: "#888888",
  rule: "#e8e8e8",
  ruleFaint: "#f0f0f0",
  tint: "#fbfbfb",
  white: "#ffffff",
} as const;

export function presetFor(frontmatter: DocumentFrontmatter): Preset {
  const type = frontmatter.type ?? (frontmatter.invoice ? "invoice" : "letterhead");
  return PRESETS[type] ?? PRESETS.letterhead!;
}

/** Preset margins with any front-matter override applied on top. */
export function resolveMargins(preset: Preset, frontmatter: DocumentFrontmatter): Margins {
  const override = frontmatter.page?.margins;
  if (!override) return preset.margins;

  return {
    top: override.top ?? preset.margins.top,
    right: override.right ?? preset.margins.right,
    bottom: override.bottom ?? preset.margins.bottom,
    left: override.left ?? preset.margins.left,
  };
}

export function resolvePageSize(frontmatter: DocumentFrontmatter): {
  width: number;
  height: number;
} {
  const base = PAGE_SIZES[frontmatter.page?.size ?? "A4"];
  return frontmatter.page?.orientation === "landscape"
    ? { width: base.height, height: base.width }
    : { width: base.width, height: base.height };
}
