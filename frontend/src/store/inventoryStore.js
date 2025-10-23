import mock from "@/data/inventory";
const KEY = "cscdInventoryExtras";
function load() {
  try {
    const r = localStorage.getItem(KEY);
    return r ? JSON.parse(r) : [];
  } catch {
    return [];
  }
}
function save(v) {
  localStorage.setItem(KEY, JSON.stringify(v));
}
export function getAllInventory() {
  return [...mock, ...load()].sort((a, b) => Number(b.id) - Number(a.id));
}
export function addInventory(item) {
  const extras = load();
  const id = Date.now();
  const rec = { id, ...item };
  extras.unshift(rec);
  save(extras);
  return rec;
}
export function updateInventory(id, patch) {
  const extras = load();
  const i = extras.findIndex((x) => String(x.id) == String(id));
  if (i >= 0) {
    extras[i] = { ...extras[i], ...patch, id: extras[i].id };
    save(extras);
    return extras[i];
  }
  return null;
}
export function deleteInventory(id) {
  const extras = load();
  save(extras.filter((x) => String(x.id) !== String(id)));
  return true;
}
