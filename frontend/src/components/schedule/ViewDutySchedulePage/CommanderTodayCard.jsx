// src/components/CommanderTodayCard.jsx
import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Security";

export default function CommanderTodayCard({ commander, date }) {
  if (!commander) return null;
  const { rank, position, fullname, phone } = commander;
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>
              <ShieldIcon />
            </Avatar>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Trực chỉ huy
              </Typography>
              <Typography variant="h6">
                {rank} {fullname}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📞 {phone}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
