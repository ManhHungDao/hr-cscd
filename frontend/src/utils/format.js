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
    return `${fmt.format(s)} - ${e.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  return `${fmt.format(s)} → ${fmt.format(e)}`;
}

// src/utils/format.js
export function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

export function truncate(text, len = 80) {
  if (!text) return "";
  return text.length > len ? text.slice(0, len - 1) + "…" : text;
}

export const SECURITY_LEVELS = [
  { value: "public", label: "Công khai", color: "default" },
  { value: "internal", label: "Nội bộ", color: "info" },
  { value: "confidential", label: "Mật", color: "warning" },
  { value: "secret", label: "Tuyệt mật", color: "error" },
  { value: "top_secret", label: "Tối mật", color: "error" },
];

export const DOC_TYPES = [
  { value: "decision", label: "Quyết định" },
  { value: "report", label: "Báo cáo" },
  { value: "memo", label: "Công văn/Ghi nhớ" },
  { value: "contract", label: "Hợp đồng" },
  { value: "image", label: "Hình ảnh" },
  { value: "other", label: "Khác" },
];
