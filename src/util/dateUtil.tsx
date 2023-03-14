export function formatDate(date: Date): string {
  return date.toLocaleString("local", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
