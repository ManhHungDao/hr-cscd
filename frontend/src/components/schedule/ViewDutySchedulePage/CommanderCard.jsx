// components/CommanderCard.jsx
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function CommanderCard({ commander }) {
  const { rank, position, fullname, phone } = commander || {};
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar>
            <AccountCircleIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle2">
              {rank} — {position}
            </Typography>
            <Typography variant="h6">{fullname}</Typography>
            <Typography variant="body2" color="text.secondary">
              📞 {phone}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
