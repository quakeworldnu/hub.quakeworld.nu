// query string from params, e.g. { a: 1, b: "x y" } => "a=1&b=x+y"
export function toQueryString(
  params: Record<string, string | number | undefined>,
): string {
  return new URLSearchParams(params as Record<string, string>).toString();
}
