import  { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";

const SHIFTS = ["Sáng", "Chiều", "Đêm", "Đặc biệt"];

export default function DutyDialog({ open, onClose, onSave, editDuty }) {
  const [form, setForm] = useState({
    date: new Date(),
    shift: "",
    officer: "",
    note: "",
  });

  useEffect(() => {
    if (editDuty) setForm(editDuty);
    else setForm({ date: new Date(), shift: "", officer: "", note: "" });
  }, [editDuty]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editDuty ? "Chỉnh sửa lịch trực" : "Thêm lịch trực mới"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Ca trực"
            name="shift"
            value={form.shift}
            onChange={handleChange}
            fullWidth
          >
            {SHIFTS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Tên cán bộ chiến sĩ"
            name="officer"
            value={form.officer}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Ghi chú"
            name="note"
            value={form.note}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSave(form)}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
