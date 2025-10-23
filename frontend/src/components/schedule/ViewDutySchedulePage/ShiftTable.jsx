// src/components/ShiftTable.jsx
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

export default function ShiftTable({ expandedShifts }) {
  // expandedShifts: [{ id, label, from, to, slots: [{start,end,soldiers:[...]}, ...] }]
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ca</TableCell>
            <TableCell>Thời gian</TableCell>
            <TableCell>Slot</TableCell>
            <TableCell>Chiến sĩ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expandedShifts.map((shift) =>
            shift.slots.map((slot, idx) => (
              <TableRow key={`${shift.id}-${idx}`}>
                <TableCell>{shift.label}</TableCell>
                <TableCell>
                  {shift.from}–{shift.to}
                </TableCell>
                <TableCell>
                  {slot.start}–{slot.end}
                </TableCell>
                <TableCell>
                  {slot.soldiers.map((s) => (
                    <Chip
                      key={s.id}
                      label={`${s.name} (${s.badge})`}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
