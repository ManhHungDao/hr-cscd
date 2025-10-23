// components/ShiftList.jsx
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

function formatTimeRange(start, end) {
  return `${start} — ${end}`;
}

export default function ShiftList({ shifts }) {
  if (!shifts || shifts.length === 0) {
    return null;
  }

  return (
    <div>
      {shifts.map((s) => (
        <Card key={s.id} variant="outlined" sx={{ mb: 1 }}>
          <CardHeader
            title={s.label}
            subheader={formatTimeRange(s.start, s.end)}
            avatar={
              <Chip
                icon={<GroupIcon />}
                label={s.soldiers.length}
                size="small"
              />
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <List dense>
              {s.soldiers.map((soldier) => (
                <React.Fragment key={soldier.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${soldier.name} (${soldier.badge || "-"})`}
                      secondary={soldier.phone}
                    />
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Xem hồ sơ">
                        <Chip label="Hồ sơ" size="small" />
                      </Tooltip>
                    </Stack>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
