import { Stack, Typography } from "@mui/material";

export default function TimelineList({
  items = [],
  fields = [],
  empty = "Chưa có dữ liệu",
}) {
  if (!items.length) return <Typography variant="body2">{empty}</Typography>;
  return (
    <Stack spacing={1.25}>
      {items.map((it, idx) => (
        <Stack
          key={idx}
          spacing={0.5}
          sx={{ p: 1.25, borderRadius: 2, bgcolor: "action.hover" }}
        >
          {fields.map((f, i) => (
            <Typography key={i} variant={i === 0 ? "subtitle2" : "body2"}>
              {typeof f === "function" ? f(it) : it[f] ?? "—"}
            </Typography>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
