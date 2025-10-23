import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DutyTable({ duties, onEdit, onDelete }) {
  if (duties.length === 0) {
    return <p>Không có lịch trực trong ngày này.</p>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Ca trực</TableCell>
          <TableCell>Cán bộ</TableCell>
          <TableCell>Ghi chú</TableCell>
          <TableCell align="center">Thao tác</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {duties.map((duty) => (
          <TableRow key={duty.id}>
            <TableCell>{duty.shift}</TableCell>
            <TableCell>{duty.officer}</TableCell>
            <TableCell>{duty.note || "-"}</TableCell>
            <TableCell align="center">
              <Tooltip title="Sửa">
                <IconButton onClick={() => onEdit(duty)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton color="error" onClick={() => onDelete(duty.id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
