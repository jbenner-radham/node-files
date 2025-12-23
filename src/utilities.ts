export function toString(value: unknown): string {
  return value?.toString() ?? String(value);
}
