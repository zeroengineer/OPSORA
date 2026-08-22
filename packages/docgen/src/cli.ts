/*
 * Renders a source file to PDF, with no database and no server involved —
 * which is deliberate: only one process can hold the embedded PGlite
 * directory, so keeping the engine dependency-free lets it run alongside a
 * live API.
 *
 *   bun src/cli.ts <input.md> [output.pdf]
 */
import { readFileSync, writeFileSync } from "node:fs";

import { renderDocument } from "./render.ts";

const [input, output] = process.argv.slice(2);

if (!input) {
  console.error("usage: bun src/cli.ts <input.md> [output.pdf]");
  process.exit(1);
}

const target = output ?? input.replace(/\.md$/, "") + ".pdf";

try {
  const { pdf, pages, warnings } = await renderDocument(readFileSync(input, "utf-8"));
  writeFileSync(target, pdf);
  for (const warning of warnings) console.warn(`! ${warning}`);
  console.log(`✓ ${target} — ${String(pages)} page(s), ${String(pdf.byteLength)} bytes`);
} catch (cause) {
  console.error(cause instanceof Error ? cause.message : String(cause));
  process.exit(1);
}
