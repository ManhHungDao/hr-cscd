import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Stack,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { isWrapped } from "../utils/time";

export default function ShiftTable({
  shifts,
  targets,
  soldiers,
  onEdit,
  onRemove,
  onToggleAssign,
}) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Mục tiêu</TableCell>
          <TableCell>Thời gian</TableCell>
          <TableCell>Yêu cầu</TableCell>
          <TableCell>Phân công</TableCell>
          <TableCell align="right">Thao tác</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shifts.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>
              <Typography color="text.secondary">
                Chưa có ca trực nào cho ngày này.
              </Typography>
            </TableCell>
          </TableRow>
        )}
        {shifts.map((s) => {
          const tgt = targets.find((t) => t.id === s.targetId);
          const wrapped = isWrapped(s.start, s.end);
          return (
            <TableRow key={s.id} hover>
              <TableCell>{s.id}</TableCell>
              <TableCell>{tgt?.name || s.targetId}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={s.start} size="small" />–
                  <Chip label={s.end} size="small" />
                  {wrapped && <Chip label="Qua đêm" size="small" />}
                </Stack>
              </TableCell>
              <TableCell>
                <Chip label={`${s.required} người`} size="small" />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {soldiers.map((u) => (
                    <Tooltip key={u.id} title={u.name}>
                      <Chip
                        variant={
                          s.assigned.includes(u.id) ? "filled" : "outlined"
                        }
                        label={u.name}
                        onClick={() => onToggleAssign(s.id, u.id)}
                        size="small"
                      />
                    </Tooltip>
                  ))}
                </Stack>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(s)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemove(s.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
