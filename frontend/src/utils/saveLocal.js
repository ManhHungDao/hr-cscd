
// src/utils/saveLocal.js
// Allow saving files directly to the user's machine using
// the File System Access API (if available) with a safe fallback.

function isFSAvailable() {
  return typeof window !== "undefined" &&
    ("showSaveFilePicker" in window || "showDirectoryPicker" in window);
}

export async function saveBlobToDisk(blob, suggestedName = "download.bin") {
  try {
    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [{
          description: "All Files",
          accept: { "*/*": [".*"] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return { ok: true, method: "fsapi" };
    }
  } catch (e) {
    console.warn("FS API save canceled or failed:", e);
  }

  // Fallback: anchor download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { ok: true, method: "anchor" };
}

export async function saveJSONToDisk(obj, suggestedName = "data.json") {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  return saveBlobToDisk(blob, suggestedName);
}

export async function saveDataUrlToDisk(dataUrl, suggestedName = "image.png") {
  // Convert data URL to Blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return saveBlobToDisk(blob, suggestedName);
}
