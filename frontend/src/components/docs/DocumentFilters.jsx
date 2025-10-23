// src/components/docs/DocumentFilters.jsx
import { Box, Stack, TextField, MenuItem, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DOC_TYPES, SECURITY_LEVELS } from "@/utils/format";

export default function DocumentFilters({
  query,
  setQuery,
  type,
  setType,
  security,
  setSecurity,
  onReset,
}) {
  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          size="small"
          fullWidth
          placeholder="Tìm theo tên, mã, người tạo, ghi chú..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
        />
        <TextField
          size="small"
          select
          label="Loại văn bản"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {DOC_TYPES.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          select
          label="Cấp bảo mật"
          value={security}
          onChange={(e) => setSecurity(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {SECURITY_LEVELS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          sx={{ minWidth: "fit-content" }}
        >
          Xoá lọc
        </Button>
      </Stack>
    </Box>
  );
}
