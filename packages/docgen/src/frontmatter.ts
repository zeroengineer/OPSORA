import { parse as parseYaml } from "yaml";

export interface SplitSource {
  /** Raw YAML between the `---` fences, or null when there is no block. */
  frontmatter: string | null;
  /** Everything after the closing fence — the markdown body. */
  body: string;
}

/*
 * A front-matter block is a `---` on the very first line, closed by the next
 * `---` on its own line. Anything else is treated as body, so the 33 existing
 * .md files — none of which have front-matter — keep rendering unchanged.
 *
 * Note the deliberate asymmetry with the markdown `---` divider: only a fence
 * on line 1 opens front-matter, so a horizontal rule mid-document is never
 * mistaken for one.
 */
const OPENING_FENCE = /^---[ \t]*\r?\n/;
const CLOSING_FENCE = /\r?\n---[ \t]*(?:\r?\n|$)/;

export function splitFrontmatter(source: string): SplitSource {
  if (!OPENING_FENCE.test(source)) {
    return { frontmatter: null, body: source };
  }

  const afterOpening = source.replace(OPENING_FENCE, "");
  const closing = CLOSING_FENCE.exec(afterOpening);

  // An unterminated fence is far more likely a `---` divider on line 1 than a
  // broken block, so fall back to treating the whole file as body.
  if (!closing?.index) return { frontmatter: null, body: source };

  return {
    frontmatter: afterOpening.slice(0, closing.index),
    body: afterOpening.slice(closing.index + closing[0].length),
  };
}

/** Parses the YAML block. Returns `{}` when there is none. */
export function parseFrontmatter(frontmatter: string | null): unknown {
  if (frontmatter === null || frontmatter.trim().length === 0) return {};

  try {
    return parseYaml(frontmatter) ?? {};
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`Front-matter is not valid YAML — ${detail}`);
  }
}
