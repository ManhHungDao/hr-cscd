import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";

export default function CommanderCard({
  commanders,
  date,
  commanderId,
  onDateChange,
  onCommanderChange,
}) {
  const commander = useMemo(
    () => commanders.find((c) => c.id === commanderId) || null,
    [commanders, commanderId]
  );
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        avatar={<ShieldIcon />}
        title="Ca trực chỉ huy"
        subheader="Chọn ngày & chỉ huy trực chỉ huy"
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ngày"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="commander-label">Chỉ huy trực</InputLabel>
              <Select
                labelId="commander-label"
                label="Chỉ huy trực"
                value={commanderId}
                onChange={(e) => onCommanderChange(e.target.value)}
              >
                {commanders.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Alert severity={commander ? "success" : "warning"}>
              Trực CH ngày <b>{date}</b>:{" "}
              <b>{commander ? commander.name : "Chưa chọn"}</b>
            </Alert>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
