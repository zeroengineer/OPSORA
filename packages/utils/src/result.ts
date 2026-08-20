/** Explicit success/failure value, for flows where throwing is the wrong tool. */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(
  result: Result<T, E>,
): result is { ok: true; value: T } {
  return result.ok;
}

export async function tryCatch<T>(
  fn: () => Promise<T>,
): Promise<Result<T, Error>> {
  try {
    return ok(await fn());
  } catch (cause) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
}
