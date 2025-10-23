import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { addTraining } from "@/store/trainingStore";

const STATUS = [
  { value: "planned", label: "Sắp diễn ra" },
  { value: "ongoing", label: "Đang diễn ra" },
  { value: "finished", label: "Đã hoàn thành" },
];

function ChipInput({ label, value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange?.([...(value || []), v]);
    setDraft("");
  };
  const remove = (i) => onChange?.(value.filter((_, idx) => idx !== i));

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          size="small"
          fullWidth
        />
        <Button onClick={add} variant="outlined" startIcon={<AddIcon />}>
          Thêm
        </Button>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {(value || []).map((m, idx) => (
          <Chip
            key={idx}
            label={m}
            onDelete={() => remove(idx)}
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function CoachFields({ coaches = [], onChange }) {
  const [c, setC] = useState({ rank: "", name: "", role: "", phone: "" });
  const add = () => {
    if (!c.name.trim()) return;
    onChange?.([...(coaches || []), c]);
    setC({ rank: "", name: "", role: "", phone: "" });
  };
  const remove = (i) => onChange?.(coaches.filter((_, idx) => idx !== i));
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        Ban huấn luyện
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Hàm/Cấp bậc"
            value={c.rank}
            onChange={(e) => setC({ ...c, rank: e.target.value })}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Họ tên"
            value={c.name}
            onChange={(e) => setC({ ...c, name: e.target.value })}
            size="small"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Vai trò"
            value={c.role}
            onChange={(e) => setC({ ...c, role: e.target.value })}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="SĐT"
            value={c.phone}
            onChange={(e) => setC({ ...c, phone: e.target.value })}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={add} startIcon={<AddIcon />} variant="outlined">
            Thêm huấn luyện viên
          </Button>
        </Grid>
      </Grid>
      <List dense>
        {(coaches || []).map((p, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton edge="end" onClick={() => remove(idx)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${p.rank ?? ""} ${p.name}${
                p.role ? " — " + p.role : ""
              }`}
              secondary={p.phone}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

function CheckpointFields({ checkpoints = [], onChange }) {
  const [c, setC] = useState({ title: "", when: "", type: "", note: "" });
  const add = () => {
    if (!c.title.trim()) return;
    onChange?.([...(checkpoints || []), c]);
    setC({ title: "", when: "", type: "", note: "" });
  };
  const remove = (i) => onChange?.(checkpoints.filter((_, idx) => idx !== i));

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        Kiểm tra/Đánh giá
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Tiêu đề"
            value={c.title}
            onChange={(e) => setC({ ...c, title: e.target.value })}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Thời gian"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={c.when}
            onChange={(e) => setC({ ...c, when: e.target.value })}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            label="Hình thức"
            value={c.type}
            onChange={(e) => setC({ ...c, type: e.target.value })}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            label="Ghi chú"
            value={c.note}
            onChange={(e) => setC({ ...c, note: e.target.value })}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={add} startIcon={<AddIcon />} variant="outlined">
            Thêm mốc kiểm tra
          </Button>
        </Grid>
      </Grid>
      <List dense>
        {(checkpoints || []).map((p, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton edge="end" onClick={() => remove(idx)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={p.title}
              secondary={`${p.when || ""} • ${p.type || ""} ${
                p.note ? "• " + p.note : ""
              }`}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default function TrainingManage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    status: "planned",
    startAt: "",
    endAt: "",
    duration: 1,
    location: "",
    content: "",
    coaches: [],
    participantsText: "",
    modules: [],
    checkpoints: [],
  });

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    const participants = (form.participantsText || "")
      .split(/[\n,]+/)
      .map((x) => x.trim())
      .filter(Boolean)
      .map((name, i) => ({ id: i + 1, name }));

    const payload = {
      name: form.name,
      status: form.status,
      startAt: form.startAt,
      endAt: form.endAt,
      duration: Number(form.duration) || 1,
      location: form.location,
      content: form.content,
      coaches: form.coaches,
      participants,
      modules: form.modules,
      checkpoints: form.checkpoints,
    };

    const rec = addTraining(payload);
    nav(`/training/${rec.id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton
          component={RouterLink}
          to="/training"
          size="small"
          sx={{ color: "var(--color-text)" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          Quản lý khóa huấn luyện
        </Typography>
      </Stack>

      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Tên khóa huấn luyện"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                    fullWidth
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        select
                        label="Trạng thái"
                        value={form.status}
                        onChange={(e) => set("status", e.target.value)}
                        fullWidth
                      >
                        {STATUS.map((s) => (
                          <MenuItem key={s.value} value={s.value}>
                            {s.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Bắt đầu"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={form.startAt}
                        onChange={(e) => set("startAt", e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Kết thúc"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={form.endAt}
                        onChange={(e) => set("endAt", e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Số buổi (duration)"
                        type="number"
                        inputProps={{ min: 1 }}
                        value={form.duration}
                        onChange={(e) => set("duration", e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        label="Địa điểm"
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    label="Nội dung huấn luyện"
                    value={form.content}
                    onChange={(e) => set("content", e.target.value)}
                    multiline
                    minRows={4}
                    fullWidth
                  />

                  <Divider />

                  <CoachFields
                    coaches={form.coaches}
                    onChange={(v) => set("coaches", v)}
                  />

                  <Divider />

                  <ChipInput
                    label="Các mô-đun/nội dung"
                    value={form.modules}
                    onChange={(v) => set("modules", v)}
                    placeholder="Ví dụ: An toàn súng"
                  />

                  <Divider />

                  <CheckpointFields
                    checkpoints={form.checkpoints}
                    onChange={(v) => set("checkpoints", v)}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Thành phần tham gia
                  </Typography>
                  <TextField
                    label="Danh sách CBCS tham gia"
                    placeholder="Mỗi tên cách nhau bằng dấu phẩy hoặc xuống dòng"
                    value={form.participantsText}
                    onChange={(e) => set("participantsText", e.target.value)}
                    multiline
                    minRows={6}
                    fullWidth
                  />
                  <Button type="submit" variant="contained">
                    Lưu & Tạo khóa
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
