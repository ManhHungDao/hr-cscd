export function formatDateRange(startISO, endISO) {
  const fmt = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const s = new Date(startISO);
  const e = new Date(endISO);
  const sameDay = s.toDateString() === e.toDateString();
  if (sameDay) {
    return `${fmt.format(s)} - ${e.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return `${fmt.format(s)} → ${fmt.format(e)}`;
}
