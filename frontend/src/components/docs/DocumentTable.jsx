import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import PreviewIcon from "@mui/icons-material/Preview";
import EllipsisCell from "@/components/EllipsisCell";

const TABLE_HEADERS = [
  { label: "Mã / Tên", key: "name", width: 320 },
  { label: "Loại", key: "type", width: 140 },
  { label: "Bảo mật", key: "security", width: 120 },
  { label: "Cập nhật", key: "updatedAt", width: 160 },
  { label: "Ghi chú", key: "notes", width: 260 },
  { label: "Hành động", key: "actions", width: 120, align: "right" },
];

const securityChip = (s) => {
  switch ((s || "").toLowerCase()) {
    case "public":
    case "công khai":
      return { label: "Công khai", color: "success", variant: "variant" };
    case "internal":
    case "nội bộ":
      return { label: "Nội bộ", color: "warning", variant: "variant" };
    case "confidential":
    case "mật":
      return { label: "Mật", color: "error", variant: "variant" };
    default:
      return { label: s || "-", variant: "variant" };
  }
};

// 💡 Icon hiển thị theo loại file
const typeIcon = (type) => {
  if (!type) return null;
  const t = type.toLowerCase();
  if (t.includes("image") || t.includes("jpg") || t.includes("png"))
    return <ImageIcon fontSize="small" color="primary" />;
  // if (t.includes("memo") || t.includes("text") || t.includes("note"))
  return <DescriptionIcon fontSize="small" color="action" />;
  // return <DescriptionIcon fontSize="small" color="disabled" />;
};

export default function DocumentTable({ rows = [], onPreview }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            {TABLE_HEADERS.map((col) => (
              <TableCell
                key={col.key}
                width={col.width}
                align={col.align || "left"}
                sx={{
                  width: col.width,
                  maxWidth: col.width,
                  overflow: "hidden",
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} hover>
              {TABLE_HEADERS.map((col) => {
                const value = (() => {
                  switch (col.key) {
                    case "name":
                      return (
                        <Stack
                          direction="column"
                          spacing={0.25}
                          sx={{ minWidth: 0 }}
                        >
                          <EllipsisCell text={r.name} width={col.width} />
                          <Typography variant="caption" color="text.secondary">
                            {r.id}
                          </Typography>
                        </Stack>
                      );
                    case "type":
                      return (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ minWidth: 0 }}
                        >
                          {typeIcon(r.type)}
                        </Stack>
                      );
                    case "security":
                      return (
                        <Chip size="small" {...securityChip(r.security)} />
                      );

                    case "updatedAt":
                      return (
                        <EllipsisCell
                          text={
                            r.updatedAt
                              ? new Date(r.updatedAt).toLocaleString("vi-VN")
                              : "-"
                          }
                          width={col.width}
                          align={col.align}
                        />
                      );
                    case "notes":
                      return (
                        <EllipsisCell
                          text={r.notes}
                          width={col.width}
                          align={col.align}
                        />
                      );
                    case "actions":
                      return (
                        <Box sx={{ textAlign: "right" }}>
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              onClick={() => onPreview?.(r)}
                            >
                              <PreviewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      );
                    default:
                      return <EllipsisCell text="" width={col.width} />;
                  }
                })();

                return (
                  <TableCell
                    key={`${r.id}-${col.key}`}
                    align={col.align || "left"}
                    sx={{
                      width: col.width,
                      maxWidth: col.width,
                      overflow: "hidden",
                      "& *": { minWidth: 0 },
                    }}
                  >
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}

          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={TABLE_HEADERS.length} align="center">
                <Typography color="text.secondary" py={2}>
                  Không có dữ liệu phù hợp.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
