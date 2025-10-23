import trainingsMock from "@/data/trainings";

const KEY = "extraTrainings";

function loadExtras() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExtras(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getAllTrainings() {
  return [...trainingsMock, ...loadExtras()].sort((a,b) => String(b.id).localeCompare(String(a.id)));
}

export function getTrainingById(id) {
  const all = getAllTrainings();
  return all.find((t) => String(t.id) === String(id));
}

export function addTraining(newT) {
  const extras = loadExtras();
  const id = Date.now();
  const record = { id, ...newT };
  extras.unshift(record);
  saveExtras(extras);
  return record;
}
