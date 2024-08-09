/**
 * parses datetime string from RFC3339 format into human readable string
 *
 * # example
 *
 * const datetimeString = "2024-08-09T13:25:17.514Z"
 * console.log(datetimeString) # Wednesday, August 7, 2024, 10:22:01
 */
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
