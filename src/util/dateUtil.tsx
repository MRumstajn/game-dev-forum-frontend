export function formatDate(date: Date | undefined): string {
  if (date === undefined || date === null) {
    return "";
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
