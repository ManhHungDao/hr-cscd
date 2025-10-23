import { useMemo, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CommanderCard from "./components/duty/CommanderCard";
import TargetSummaryTable from "./components/duty/TargetSummaryTable";
import ShiftForm from "./components/duty/ShiftForm";
import ShiftTable from "./components/duty/ShiftTable";
import {
  timeToMinutes,
  rangesOverlap,
  isValidRange,
} from "./components/utils/time";

const MOCK_COMMANDERS = [
  { id: "c01", name: "Đ/c Nguyễn Văn An" },
  { id: "c02", name: "Đ/c Trần Quốc Bảo" },
  { id: "c03", name: "Đ/c Lê Minh Châu" },
];
const MOCK_SOLDIERS = [
  { id: "s01", name: "CS1" },
  { id: "s02", name: "CS2" },
  { id: "s03", name: "CS3" },
  { id: "s04", name: "CS4" },
  { id: "s05", name: "CS5" },
  { id: "s06", name: "CS6" },
  { id: "s07", name: "CS7" },
  { id: "s08", name: "CS8" },
];
const MOCK_TARGETS = [
  { id: "t01", name: "Mục tiêu A – Trụ sở UBND", required: 6 },
  { id: "t02", name: "Mục tiêu B – Ngân hàng X", required: 4 },
  { id: "t03", name: "Mục tiêu C – Kho vật chứng", required: 8 },
];

export default function DutySchedulePage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [commanderId, setCommanderId] = useState("");
  const [targets, setTargets] = useState(MOCK_TARGETS);
  const [soldiers] = useState(MOCK_SOLDIERS);
  const [shifts, setShifts] = useState([]); // { id, targetId, start, end, required, assigned }
  const [draft, setDraft] = useState({
    id: null,
    targetId: "",
    start: "",
    end: "",
    required: 2,
    assigned: [],
    editing: false,
  });
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    severity: "info",
  });

  function resetDraft() {
    setDraft({
      id: null,
      targetId: "",
      start: "",
      end: "",
      required: 2,
      assigned: [],
      editing: false,
    });
  }

  function validateShift(candidate, excludeId = null) {
    if (!candidate.targetId) return "Chưa chọn Mục tiêu";
    if (!candidate.start || !candidate.end) return "Chưa chọn thời gian";
    if (!isValidRange(candidate.start, candidate.end))
      return "Khoảng thời gian không hợp lệ";
    for (const s of shifts) {
      if (excludeId && s.id === excludeId) continue;
      if (s.targetId !== candidate.targetId) continue; // chỉ check trong cùng mục tiêu
      if (rangesOverlap(candidate.start, candidate.end, s.start, s.end)) {
        return `Trùng thời gian với ca #${s.id} (${s.start}–${s.end}) tại cùng mục tiêu`;
      }
    }
    return null;
  }

  function addShift() {
    const err = validateShift(draft);
    if (err) return setToast({ open: true, msg: err, severity: "error" });
    const newShift = {
      id: String(shifts.length + 1).padStart(3, "0"),
      targetId: draft.targetId,
      start: draft.start,
      end: draft.end,
      required: Number(draft.required) || 1,
      assigned: Array.isArray(draft.assigned)
        ? draft.assigned.slice(0, Number(draft.required) || 1)
        : [],
    };
    setShifts((prev) => [...prev, newShift]);
    resetDraft();
    setToast({ open: true, msg: "Đã thêm ca trực", severity: "success" });
  }

  function startEdit(shift) {
    setDraft({ ...shift, editing: true });
  }

  function saveEdit() {
    const err = validateShift(draft, draft.id);
    if (err) return setToast({ open: true, msg: err, severity: "error" });
    setShifts((prev) =>
      prev.map((s) =>
        s.id === draft.id
          ? {
              ...draft,
              required: Number(draft.required) || 1,
              assigned: draft.assigned.slice(0, Number(draft.required) || 1),
            }
          : s
      )
    );
    resetDraft();
    setToast({ open: true, msg: "Đã cập nhật ca", severity: "success" });
  }

  function removeShift(id) {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleAssign(shiftId, soldierId) {
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id !== shiftId) return s;
        const has = s.assigned.includes(soldierId);
        let next = has
          ? s.assigned.filter((x) => x !== soldierId)
          : [...s.assigned, soldierId];
        if (next.length > s.required) next = next.slice(0, s.required);
        return { ...s, assigned: next };
      })
    );
  }

  function exportJSON() {
    const payload = { date, commanderId, shifts };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roster_${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const sortedShifts = useMemo(
    () =>
      shifts
        .slice()
        .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)),
    [shifts]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={700}>
          Quản lý lịch trực
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={exportJSON}>
            Xuất JSON
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <CommanderCard
            commanders={MOCK_COMMANDERS}
            date={date}
            commanderId={commanderId}
            onDateChange={setDate}
            onCommanderChange={setCommanderId}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <TargetSummaryTable targets={targets} shifts={shifts} />
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader
              avatar={<ScheduleIcon />}
              title="Ca trực trong ngày"
              subheader="Không trùng lặp trong CÙNG mục tiêu — hỗ trợ ca qua đêm (0h–24h)"
            />
            <Divider />
            <CardContent>
              <ShiftForm
                targets={targets}
                draft={draft}
                setDraft={setDraft}
                onAdd={addShift}
                onSave={saveEdit}
              />
              <Divider sx={{ my: 2 }} />
              <ShiftTable
                shifts={sortedShifts}
                targets={targets}
                soldiers={soldiers}
                onEdit={startEdit}
                onRemove={removeShift}
                onToggleAssign={toggleAssign}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
