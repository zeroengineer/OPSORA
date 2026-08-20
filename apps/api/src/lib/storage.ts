import { hasR2Config } from "@opsora/config/server";

export interface StoredFile {
  data: Buffer;
  contentType: string;
}

export interface StorageAdapter {
  save(key: string, data: Buffer | Uint8Array, contentType: string): Promise<void>;
  read(key: string): Promise<StoredFile>;
  delete(key: string): Promise<void>;
  /** Best-effort direct URL. Local storage returns null — callers must go through an authenticated route. */
  getUrl(key: string): string | null;
}

const STORAGE_ROOT = new URL("../../storage/", import.meta.url);

/**
 * Writes files to a local, gitignored directory. `getUrl()` always returns
 * null by design: nothing should link directly to disk, everything goes
 * through an authenticated download route (see documents.routes.ts).
 */
class LocalStorageAdapter implements StorageAdapter {
  private resolve(key: string): URL {
    if (key.includes("..")) {
      throw new Error(`Refusing to resolve storage key outside its root: ${key}`);
    }
    return new URL(key, STORAGE_ROOT);
  }

  async save(key: string, data: Buffer | Uint8Array, contentType: string): Promise<void> {
    const target = this.resolve(key);
    await Bun.write(target, data);
    await Bun.write(new URL(`${target.href}.meta`), contentType);
  }

  async read(key: string): Promise<StoredFile> {
    const target = this.resolve(key);
    const file = Bun.file(target);

    if (!(await file.exists())) {
      throw new Error(`Storage key not found: ${key}`);
    }

    const [data, contentType] = await Promise.all([
      file.arrayBuffer(),
      Bun.file(new URL(`${target.href}.meta`))
        .text()
        .catch(() => "application/octet-stream"),
    ]);

    return { data: Buffer.from(data), contentType };
  }

  async delete(key: string): Promise<void> {
    const target = this.resolve(key);
    await Promise.all([
      Bun.file(target).delete().catch(() => undefined),
      Bun.file(new URL(`${target.href}.meta`)).delete().catch(() => undefined),
    ]);
  }

  getUrl(): string | null {
    return null;
  }
}

let adapter: StorageAdapter | undefined;

/**
 * Local storage for now — R2 credentials are blank. When they're
 * configured, swap this factory to `new R2StorageAdapter(...)` behind
 * `hasR2Config()`; R2StorageAdapter is not implemented yet.
 */
export function getStorageAdapter(): StorageAdapter {
  if (hasR2Config()) {
    // TODO(R2): return new R2StorageAdapter(...) once implemented.
  }

  adapter ??= new LocalStorageAdapter();
  return adapter;
}
