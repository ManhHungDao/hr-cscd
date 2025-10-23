// src/components/docs/DocumentUploadDialog.jsx
import { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { DOC_TYPES, SECURITY_LEVELS } from "@/utils/format";
import { saveBlobToDisk } from "@/utils/saveLocal";

export default function DocumentUploadDialog({ open, onClose, onCreate }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    type: "other",
    security: "internal",
    owner: "Văn thư",
    notes: "",
    autoSave: false,
  });
  const [file, setFile] = useState(null);

  const chooseFile = (e) => setFile(e.target.files?.[0] || null);

  const submit = async () => {
    const now = new Date().toISOString();
    // Keep a blob reference (not serialized) for local save in session
    const doc = {
      id: "DOC-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
      name: form.name || (file ? file.name : "Tệp mới"),
      type: form.type,
      category: "Tải lên",
      security: form.security,
      owner: form.owner,
      size: file ? file.size : 0,
      url: "#",
      createdAt: now,
      updatedAt: now,
      notes: form.notes || "",
      __blob: file || null,
      __mime: file ? file.type || "application/octet-stream" : null,
    };

    onCreate?.(doc);

    // Optional: save immediately to disk
    if (form.autoSave && file) {
      try {
        await saveBlobToDisk(file, doc.name);
      } catch (e) {
        console.warn("Auto save failed:", e);
      }
    }

    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tải lên tệp tin</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Button variant="outlined" onClick={() => fileRef.current?.click()}>
            Chọn tệp
          </Button>
          <input
            type="file"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={chooseFile}
          />
          {file && (
            <Typography variant="body2" color="text.secondary">
              Đã chọn: {file.name} ({Math.round(file.size / 1024)} KB)
            </Typography>
          )}
          <TextField
            label="Tên hiển thị"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Loại"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              fullWidth
            >
              {DOC_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Cấp bảo mật"
              value={form.security}
              onChange={(e) => setForm({ ...form, security: e.target.value })}
              fullWidth
            >
              {SECURITY_LEVELS.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            label="Đơn vị/Chủ sở hữu"
            value={form.owner}
            onChange={(e) => setForm({ ...form, owner: e.target.value })}
            fullWidth
          />
          <TextField
            label="Ghi chú"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            fullWidth
            multiline
            minRows={3}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.autoSave}
                onChange={(e) =>
                  setForm({ ...form, autoSave: e.target.checked })
                }
              />
            }
            label="Lưu tệp vào máy ngay sau khi tải lên"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button variant="contained" onClick={submit}>
          Tải lên
        </Button>
      </DialogActions>
    </Dialog>
  );
}
