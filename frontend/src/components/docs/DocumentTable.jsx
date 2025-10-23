// src/components/docs/DocumentTable.jsx
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GavelIcon from "@mui/icons-material/Gavel";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { formatDateTime, truncate, SECURITY_LEVELS } from "@/utils/format";
import {
  saveBlobToDisk,
  saveJSONToDisk,
  saveDataUrlToDisk,
} from "@/utils/saveLocal";

function SecurityChip({ level }) {
  const meta = SECURITY_LEVELS.find((x) => x.value === level);
  if (!meta) return null;
  const colorMap = {
    default: "default",
    info: "info",
    warning: "warning",
    error: "error",
  };
  return <Chip size="small" label={meta.label} color={colorMap[meta.color]} />;
}

function TypeIcon({ type }) {
  const sx = { fontSize: 20 };
  switch (type) {
    case "decision":
      return <GavelIcon sx={sx} />;
    case "report":
      return <AssessmentIcon sx={sx} />;
    case "memo":
      return <AssignmentIcon sx={sx} />;
    case "contract":
      return <DescriptionIcon sx={sx} />;
    case "image":
      return <ImageIcon sx={sx} />;
    default:
      return <DescriptionIcon sx={sx} />;
  }
}

function humanFileSize(bytes) {
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) return bytes + " B";
  const units = ["KB", "MB", "GB", "TB"];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + " " + units[u];
}

async function saveLocally(row) {
  // Priority: original blob (if uploaded this session) -> preview data URL (for images) -> metadata JSON
  if (row.__blob) {
    await saveBlobToDisk(row.__blob, row.name || row.id + ".bin");
    return;
  }
  if (
    row.preview &&
    typeof row.preview === "string" &&
    row.preview.startsWith("data:")
  ) {
    const ext = row.preview.includes("svg+xml") ? "svg" : "png";
    await saveDataUrlToDisk(row.preview, (row.name || row.id) + "." + ext);
    return;
  }
  await saveJSONToDisk(row, (row.name || row.id) + ".json");
}

export default function DocumentTable({ rows, onPreview }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Văn bản</TableCell>
            <TableCell>Loại</TableCell>
            <TableCell>Cấp bảo mật</TableCell>
            <TableCell>Đơn vị</TableCell>
            <TableCell>Tạo lúc</TableCell>
            <TableCell>Cập nhật</TableCell>
            <TableCell>Ghi chú</TableCell>
            <TableCell align="right">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar variant="rounded" sx={{ width: 28, height: 28 }}>
                    {r.type === "image" ? (
                      <ImageIcon fontSize="small" />
                    ) : (
                      <DescriptionIcon fontSize="small" />
                    )}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600} lineHeight={1.2}>
                      {r.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {r.id} • {humanFileSize(r.size || 0)}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <TypeIcon type={r.type} />
              </TableCell>
              <TableCell>
                <SecurityChip level={r.security} />
              </TableCell>
              <TableCell>{r.owner}</TableCell>
              <TableCell>{formatDateTime(r.createdAt)}</TableCell>
              <TableCell>{formatDateTime(r.updatedAt)}</TableCell>
              <TableCell sx={{ maxWidth: 280 }}>
                {truncate(r.notes, 90)}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="Xem nhanh">
                    <IconButton size="small" onClick={() => onPreview(r)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Lưu về máy">
                    <IconButton size="small" onClick={() => saveLocally(r)}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
