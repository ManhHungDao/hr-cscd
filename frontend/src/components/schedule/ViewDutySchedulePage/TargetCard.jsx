// src/components/TargetCard.jsx
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Button,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

export default function TargetCard({ target, onOpenDetail }) {
  const { name, location, commander, previewSlots = [] } = target;
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardHeader
        title={name}
        subheader={
          <Stack direction="row" spacing={1} alignItems="center">
            <PlaceIcon fontSize="small" />
            {location}
          </Stack>
        }
        action={
          <Button
            size="small"
            variant="contained"
            onClick={() => onOpenDetail?.(target)}
          >
            Chi tiết
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label={`${commander.rank}`} size="small" />
          <Chip label={`${commander.position}`} size="small" />
          <Chip label={commander.fullname} size="small" />
        </Stack>
        <Divider sx={{ my: 1 }} />
        <List dense>
          {previewSlots.slice(0, 3).map((slot, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={`${slot.start}–${slot.end}`}
                secondary={slot.soldiers.map((s) => s.name).join(", ")}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
