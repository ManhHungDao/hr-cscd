import { Chip, Stack, Typography } from "@mui/material";

export default function DocumentsList({ docs = [] }) {
  if (!docs.length)
    return <Typography variant="body2">Chưa có tệp.</Typography>;
  return (
    <Stack spacing={1.25}>
      {docs.map((d, i) => (
        <Stack
          key={i}
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ p: 1, borderRadius: 2, bgcolor: "action.hover" }}
        >
          <Chip size="small" label={d.type || "other"} />
          <Typography variant="body2" sx={{ flex: 1 }}>
            {d.name}
          </Typography>
          {d.size ? (
            <Chip size="small" label={`${Math.round(d.size / 1024)} KB`} />
          ) : null}
          {d.url ? (
            <a
              href={d.url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 13 }}
            >
              Tải / Xem
            </a>
          ) : null}
        </Stack>
      ))}
    </Stack>
  );
}
