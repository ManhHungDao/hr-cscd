// src/components/docs/DocumentDetailDrawer.jsx
import {
  Drawer,
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatDateTime, SECURITY_LEVELS } from "@/utils/format";

export default function DocumentDetailDrawer({ open, onClose, doc }) {
  const sec = SECURITY_LEVELS.find((x) => x.value === doc?.security);
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 2 }} role="presentation">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">Chi tiết văn bản</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} />
        {doc ? (
          <Stack spacing={1.5}>
            <Typography fontWeight={700}>{doc.name}</Typography>
            {sec && (
              <Chip
                size="small"
                color={sec.color === "error" ? "error" : sec.color}
                label={sec.label}
              />
            )}
            <Typography variant="body2" color="text.secondary">
              Mã: {doc.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đơn vị: {doc.owner}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tạo lúc: {formatDateTime(doc.createdAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cập nhật: {formatDateTime(doc.updatedAt)}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Ghi chú</Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {doc.notes || "—"}
            </Typography>
            {doc.type === "image" && doc.preview && (
              <Box
                sx={{
                  mt: 2,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid #eee",
                }}
              >
                <img
                  src={doc.preview}
                  alt={doc.name}
                  style={{ width: "100%", display: "block" }}
                />
              </Box>
            )}
          </Stack>
        ) : (
          <Typography>Không có dữ liệu</Typography>
        )}
      </Box>
    </Drawer>
  );
}
