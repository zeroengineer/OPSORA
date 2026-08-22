import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** `packages/docgen/assets/` — resolved against this file, never `process.cwd()`. */
const ASSETS = new URL("../assets/", import.meta.url);

export type FontName = "Regular" | "Medium" | "SemiBold" | "Bold" | "ExtraBold";

export const FONT_NAMES: FontName[] = [
  "Regular",
  "Medium",
  "SemiBold",
  "Bold",
  "ExtraBold",
];

/*
 * Read once per process. A render registers fonts from these Buffers rather
 * than from disk, which is what keeps the live-preview round trip cheap.
 */
const fontCache = new Map<FontName, Buffer>();
const imageCache = new Map<string, Buffer>();

export function font(name: FontName): Buffer {
  const cached = fontCache.get(name);
  if (cached) return cached;

  const buffer = readFileSync(
    fileURLToPath(new URL(`fonts/Manrope-${name}.ttf`, ASSETS)),
  );
  fontCache.set(name, buffer);
  return buffer;
}

export function image(name: string): Buffer {
  const cached = imageCache.get(name);
  if (cached) return cached;

  const buffer = readFileSync(fileURLToPath(new URL(`images/${name}`, ASSETS)));
  imageCache.set(name, buffer);
  return buffer;
}

export interface Size {
  width: number;
  height: number;
}

/**
 * Intrinsic pixel dimensions from a PNG's IHDR chunk.
 *
 * The original scripts used `sharp` purely to read this (and to resize ahead
 * of a draw PDFKit already scales). Reading 8 bytes of header instead drops a
 * native dependency from the API, and embedding the full-resolution PNG gives
 * a sharper result than pre-downscaling did.
 */
export function pngSize(buffer: Buffer): Size {
  const PNG_MAGIC = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== PNG_MAGIC) {
    throw new Error("Not a PNG: IHDR dimensions unavailable");
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

/** Width an image occupies when drawn at `height`, preserving aspect ratio. */
export function widthAtHeight(buffer: Buffer, height: number): number {
  const size = pngSize(buffer);
  return size.width * (height / size.height);
}
