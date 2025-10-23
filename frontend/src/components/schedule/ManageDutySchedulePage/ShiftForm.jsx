import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { isWrapped } from "../utils/time";

export default function ShiftForm({ targets, draft, setDraft, onAdd, onSave }) {
  const wrapped = isWrapped(draft.start, draft.end);
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel id="target-label">Mục tiêu</InputLabel>
          <Select
            labelId="target-label"
            label="Mục tiêu"
            value={draft.targetId}
            onChange={(e) =>
              setDraft((d) => ({ ...d, targetId: e.target.value }))
            }
          >
            {targets.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} md={2}>
        <TextField
          label="Bắt đầu"
          type="time"
          fullWidth
          value={draft.start}
          onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <TextField
          label="Kết thúc"
          type="time"
          fullWidth
          value={draft.end}
          onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <TextField
          label="Số người/ca"
          type="number"
          inputProps={{ min: 1 }}
          fullWidth
          value={draft.required}
          onChange={(e) =>
            setDraft((d) => ({ ...d, required: Number(e.target.value) }))
          }
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <Stack direction="row" spacing={1}>
          {draft.editing ? (
            <>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={onSave}
              >
                Lưu
              </Button>
              <Button
                startIcon={<CancelIcon />}
                variant="text"
                onClick={() =>
                  setDraft({
                    id: null,
                    targetId: "",
                    start: "",
                    end: "",
                    required: 2,
                    assigned: [],
                    editing: false,
                  })
                }
              >
                Hủy
              </Button>
            </>
          ) : (
            <Button startIcon={<AddIcon />} variant="contained" onClick={onAdd}>
              Thêm ca
            </Button>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
