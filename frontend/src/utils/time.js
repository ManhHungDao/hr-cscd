export function timeToMinutes(t) {
  const [h, m] = (t || "00:00").split(":").map(Number);
  return h * 60 + m; // 0..1440
}
export function isWrapped(start, end) {
  return timeToMinutes(start) > timeToMinutes(end);
}
export function splitInterval(start, end) {
  const a = timeToMinutes(start);
  const b = timeToMinutes(end);
  if (a === b) return [];
  if (a < b) return [[a, b]];
  return [
    [a, 1440],
    [0, b],
  ];
}
export function intervalsOverlap([s1, e1], [s2, e2]) {
  return Math.max(s1, s2) < Math.min(e1, e2);
}
export function rangesOverlap(startA, endA, startB, endB) {
  const A = splitInterval(startA, endA);
  const B = splitInterval(startB, endB);
  if (A.length === 0 || B.length === 0) return false;
  for (const ia of A)
    for (const ib of B) if (intervalsOverlap(ia, ib)) return true;
  return false;
}
export function isValidRange(start, end) {
  return splitInterval(start, end).length > 0;
}

// new
// src/utils/time.js
export function pad(n) {
  return String(n).padStart(2, "0");
}

export function minutesToTime(mins) {
  const m = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${pad(h)}:${pad(mm)}`;
}

// Tạo các slot [start,end) cố định stepMinutes trong [from,to) (không qua đêm)
export function makeSlots(from = "00:00", to = "24:00", stepMinutes = 120) {
  const start = timeToMinutes(from);
  const end = timeToMinutes(to);
  const slots = [];
  for (let t = start; t < end; t += stepMinutes) {
    const s = minutesToTime(t);
    const e = minutesToTime(Math.min(t + stepMinutes, end));
    slots.push({ start: s, end: e });
  }
  return slots;
}
