import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

export default function TargetSummaryTable({ targets, shifts }) {
  const stats = useMemo(() => {
    const s = {};
    targets.forEach(
      (t) => (s[t.id] = { required: t.required, assignedTotal: 0 })
    );
    shifts.forEach((sh) => {
      if (s[sh.targetId])
        s[sh.targetId].assignedTotal += sh.assigned?.length || 0;
    });
    return s;
  }, [targets, shifts]);

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        avatar={<GroupIcon />}
        title="Mục tiêu bảo vệ"
        subheader="Chỉ tiêu quân số theo ngày"
      />
      <Divider />
      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Mục tiêu</TableCell>
              <TableCell align="right">Quân số</TableCell>
              <TableCell align="right">Đã phân</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {targets.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.name}</TableCell>
                <TableCell align="right">{t.required}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${stats[t.id]?.assignedTotal || 0} lượt trực`}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
