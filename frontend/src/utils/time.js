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
  return [[a, 1440], [0, b]];
}
export function intervalsOverlap([s1, e1], [s2, e2]) {
  return Math.max(s1, s2) < Math.min(e1, e2);
}
export function rangesOverlap(startA, endA, startB, endB) {
  const A = splitInterval(startA, endA);
  const B = splitInterval(startB, endB);
  if (A.length === 0 || B.length === 0) return false;
  for (const ia of A) for (const ib of B) if (intervalsOverlap(ia, ib)) return true;
  return false;
}
export function isValidRange(start, end) {
  return splitInterval(start, end).length > 0;
}
