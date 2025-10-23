import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  Checkbox,
  ListItemText,
  Divider,
  Typography,
  Stack,
  Chip,
} from "@mui/material";

export default function SoldierPickerDialog({
  open,
  onClose,
  onSave,
  soldiers,
  shift,
  max,
}) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected(shift?.assigned || []);
  }, [shift]);

  const reachedMax = selected.length >= max;

  function toggle(id) {
    setSelected((prev) => {
      const has = prev.includes(id);
      if (has) return prev.filter((x) => x !== id);
      if (prev.length >= max) return prev; // block over-select
      return [...prev, id];
    });
  }

  const title = useMemo(() => {
    if (!shift) return "Chọn chiến sĩ";
    return `Ca #${shift.id} (${shift.start}–${shift.end})`;
  }, [shift]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2">Số lượng:</Typography>
          <Chip label={`${selected.length}/${max}`} size="small" />
        </Stack>
        <Divider sx={{ mb: 1 }} />
        <List dense>
          {soldiers.map((s) => {
            const checked = selected.includes(s.id);
            const disabled = !checked && reachedMax;
            return (
              <ListItemButton
                key={s.id}
                onClick={() => toggle(s.id)}
                disabled={disabled}
              >
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                  checked={checked}
                />
                <ListItemText primary={s.name} />
              </ListItemButton>
            );
          })}
        </List>
        {reachedMax && (
          <Typography variant="caption" color="text.secondary">
            Đã đạt số lượng yêu cầu cho ca này.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSave(selected)}>
          Lưu phân công
        </Button>
      </DialogActions>
    </Dialog>
  );
}
