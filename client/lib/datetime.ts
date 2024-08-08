export function humanReadableDateTime(dateString: string) {
  const date = new Date(dateString);
  const formatted = date.toLocaleString("en-US", {
    weekday: "long", // e.g., "Wednesday"
    year: "numeric", // e.g., "2024"
    month: "long", // e.g., "August"
    day: "numeric", // e.g., "7"
    hour: "numeric", // e.g., "10" or "5"
    minute: "numeric", // e.g., "22"
    second: "numeric", // e.g., "01"
    hour12: true, // 12-hour format with AM/PM
  });
  return formatted;
}
