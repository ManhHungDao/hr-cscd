// utils/time.js
export function timeToMinutes(t) {
  const [h, m] = (t || "00:00").split(":").map(Number);
  return h * 60 + m; // 0..1440
}

export function isWrapped(start, end) {
  // true nếu ca qua đêm (vd 23:00 -> 06:00)
  return timeToMinutes(start) > timeToMinutes(end);
}

export function splitInterval(start, end) {
  // Trả về các khoảng [s,e) trong miền 0..1440; nếu qua đêm -> tách 2 khoảng
  const a = timeToMinutes(start);
  const b = timeToMinutes(end);
  if (a === b) return []; // 0 phút, coi như không hợp lệ
  if (a < b) return [[a, b]];
  // wrapped: a > b  -> [a,1440) và [0,b)
  return [[a, 1440], [0, b]];
}

export function intervalsOverlap([s1, e1], [s2, e2]) {
  return Math.max(s1, s2) < Math.min(e1, e2);
}

export function rangesOverlap(startA, endA, startB, endB) {
  // So sánh overlap khi có thể qua đêm bằng cách tách khoảng
  const A = splitInterval(startA, endA);
  const B = splitInterval(startB, endB);
  if (A.length === 0 || B.length === 0) return false;
  for (const ia of A) for (const ib of B) if (intervalsOverlap(ia, ib)) return true;
  return false;
}

export function isValidRange(start, end) {
  // Hợp lệ nếu có độ dài > 0 trong ngày 0..24h
  const list = splitInterval(start, end);
  return list.length > 0;
}
