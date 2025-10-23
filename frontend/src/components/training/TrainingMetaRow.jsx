import { Stack, Typography, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function TrainingMetaRow({ t, dense = false, showCountsOnly = false }) {
  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
      {!showCountsOnly && (
        <Chip size={dense ? "small" : "medium"} icon={<CalendarMonthIcon />} label={`${t.duration} buổi`} variant="outlined" />
      )}
      <Chip size={dense ? "small" : "medium"} icon={<GroupIcon />} label={`${t.participants?.length ?? 0} người`} />
      {!showCountsOnly && (
        <Chip size={dense ? "small" : "medium"} icon={<AssignmentIcon />} label={`${t.modules?.length ?? 0} nội dung`} />
      )}
    </Stack>
  );
}
