const DEFAULT_LOCALE = "en-US";

export function formatCurrency(
  amountInMinorUnits: number,
  currency = "USD",
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amountInMinorUnits / 100);
}

export function formatDate(
  value: Date | string | number,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatDateTime(
  value: Date | string | number,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatNumber(value: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value);
}
