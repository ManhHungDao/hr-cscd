// Lưu FileSystemFileHandle vào IndexedDB (client-side only).
// Lưu ý: Chỉ hoạt động tốt trên Chrome/Edge desktop.
// Safari/Firefox hiện chưa hỗ trợ đầy đủ File System Access API.

const DB_NAME = "local-file-handles";
const STORE = "handles";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putHandle(id, handle) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ id, handle });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getHandle(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result?.handle || null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteHandle(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function verifyPermission(handle, opts = { mode: "read" }) {
  if (!handle) return false;
  // Trước hết thử queryPermission
  if ((await handle.queryPermission(opts)) === "granted") return true;
  // Nếu chưa được cấp, xin cấp quyền
  if ((await handle.requestPermission(opts)) === "granted") return true;
  return false;
}
