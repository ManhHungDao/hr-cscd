import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Divider,
  TablePagination,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import { MOCK_RELATED_FILES } from "@/mocks/relatedFiles.mock";
import {
  DOC_TYPES,
  SECURITY_LEVELS,
  formatDateTime,
  truncate,
  joinNonEmpty,
} from "@/utils/format";
import {
  putHandle,
  getHandle,
  deleteHandle,
  verifyPermission,
} from "@/utils/fileHandleStore";

// -------- Config --------
const LS_KEY = "related_files_meta_only"; // chỉ lưu metadata + handleId
const PAGE_SIZE = 6;

// -------- Helpers --------
const typeLabel = (v) => DOC_TYPES.find((x) => x.value === v)?.label || "—";
const secLabel = (v) =>
  SECURITY_LEVELS.find((x) => x.value === v)?.label || "—";
const secColor = (v) =>
  SECURITY_LEVELS.find((x) => x.value === v)?.color || "default";

const guessIcon = (mime, fileName = "") => {
  if ((mime || "").startsWith("image/")) return <ImageIcon />;
  if (
    mime === "application/pdf" ||
    (fileName || "").toLowerCase().endsWith(".pdf")
  )
    return <PictureAsPdfIcon />;
  return <DescriptionIcon />;
};

// -------- File card --------
function FileCard({ item, onEdit, onDelete, onOpen, onDownloadCopy }) {
  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {guessIcon(item.mime, item.fileName)}
            <Typography variant="subtitle1" fontWeight={600}>
              {truncate(item.title, 40)}
            </Typography>
          </Stack>
          <Chip
            size="small"
            label={secLabel(item.security)}
            color={secColor(item.security)}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {joinNonEmpty([typeLabel(item.type), item.fileName], " • ")}
        </Typography>

        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {truncate(item.note || "", 160)}
        </Typography>

        <Divider sx={{ my: 1.25 }} />
        <Typography variant="caption" color="text.secondary">
          Tải lên: {formatDateTime(item.uploadedAt)}
          {item.size ? ` • ${(item.size / 1024).toFixed(1)} KB` : ""}
        </Typography>
      </CardContent>

      <Stack direction="row" spacing={1} sx={{ p: 1.25, pt: 0 }}>
        <Tooltip title="Mở tệp gốc trên máy">
          <span>
            <IconButton onClick={() => onOpen(item)} disabled={!item.handleId}>
              <FolderOpenIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Tạo bản sao để tải xuống (copy)">
          <span>
            <IconButton
              onClick={() => onDownloadCopy(item)}
              disabled={!item.handleId}
            >
              <DownloadIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Sửa metadata">
          <IconButton color="primary" onClick={() => onEdit(item)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Xoá metadata">
          <IconButton color="error" onClick={() => onDelete(item)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
}

// -------- Trang chính --------
export default function RelatedFilesPage({
  soldierId = "68fb8438067657a0a1e2e328",
}) {
  const [allItems, setAllItems] = useState([]);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [secFilter, setSecFilter] = useState("all");
  const [page, setPage] = useState(0);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});

  // load metadata từ LS (hoặc mock lần đầu)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setAllItems(JSON.parse(raw));
      else {
        // Strip mọi contentBase64 nếu có, chỉ giữ metadata
        const normalized = (MOCK_RELATED_FILES || []).map((x) => ({
          ...x,
          contentBase64: undefined,
          handleId: undefined,
        }));
        setAllItems(normalized);
        localStorage.setItem(LS_KEY, JSON.stringify(normalized));
      }
    } catch {
      setAllItems(
        MOCK_RELATED_FILES.map((x) => ({
          ...x,
          contentBase64: undefined,
          handleId: undefined,
        }))
      );
    }
  }, []);

  const persist = (next) => {
    setAllItems(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  };

  // lọc + sắp xếp
  const items = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return (allItems || [])
      .filter((x) => x.soldierId === soldierId)
      .filter((x) => (typeFilter === "all" ? true : x.type === typeFilter))
      .filter((x) => (secFilter === "all" ? true : x.security === secFilter))
      .filter((x) =>
        lower
          ? [x.title, x.fileName, x.note]
              .map((s) => (s || "").toLowerCase())
              .some((s) => s.includes(lower))
          : true
      )
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }, [allItems, soldierId, q, typeFilter, secFilter]);

  const paged = useMemo(() => {
    const start = page * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  // chọn file từ máy và tạo handleId
  const chooseLocalFile = async () => {
    if (!window.showOpenFilePicker) {
      alert(
        "Trình duyệt không hỗ trợ File System Access API. Hãy dùng Chrome/Edge trên máy tính."
      );
      return null;
    }
    try {
      const [handle] = await window.showOpenFilePicker({ multiple: false });
      const f = await handle.getFile();
      const handleId = `hdl_${crypto.randomUUID?.() || Date.now()}`;
      await putHandle(handleId, handle); // lưu handle xuống IndexedDB
      return {
        handleId,
        fileName: f.name,
        mime: f.type || "",
        size: f.size,
        lastModified: f.lastModified,
      };
    } catch (e) {
      return null; // user cancel
    }
  };

  // mở file gốc bằng handle
  const openLocalFile = async (item) => {
    if (!item.handleId) return;
    const handle = await getHandle(item.handleId);
    if (!handle) {
      alert(
        "Không tìm thấy quyền truy cập tệp trên máy này. Hãy chọn lại tệp."
      );
      return;
    }
    const ok = await verifyPermission(handle, { mode: "read" });
    if (!ok) {
      alert("Không có quyền đọc tệp. Vui lòng cấp quyền.");
      return;
    }
    const file = await handle.getFile();
    const url = URL.createObjectURL(file);
    // Mở tab mới (trình duyệt sẽ hiển thị nếu là PDF/Ảnh/Văn bản…)
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  // tạo bản sao để tải xuống (copy)
  const downloadCopy = async (item) => {
    if (!item.handleId) return;
    const handle = await getHandle(item.handleId);
    if (!handle) {
      alert(
        "Không tìm thấy quyền truy cập tệp trên máy này. Hãy chọn lại tệp."
      );
      return;
    }
    const ok = await verifyPermission(handle, { mode: "read" });
    if (!ok) {
      alert("Không có quyền đọc tệp. Vui lòng cấp quyền.");
      return;
    }
    const file = await handle.getFile();
    // Tạo link download
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.fileName || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };

  // tạo mới
  const openCreate = () => {
    setForm({
      title: "",
      type: "other",
      security: "internal",
      note: "",
      uploadedAt: new Date().toISOString(),
      handleId: undefined, // sẽ điền sau khi chọn file
      fileName: "",
      mime: "",
      size: null,
    });
    setOpen(true);
  };

  // gán/đổi tệp cục bộ cho form hiện tại
  const attachLocalFileToForm = async () => {
    const picked = await chooseLocalFile();
    if (!picked) return;
    setForm((prev) => ({
      ...prev,
      handleId: picked.handleId,
      fileName: picked.fileName,
      mime: picked.mime,
      size: picked.size,
      lastModified: picked.lastModified,
    }));
  };

  // xoá metadata + handle
  const handleDelete = async (item) => {
    if (item.handleId) {
      // Xoá luôn handle trong IndexedDB (không bắt buộc, nhưng gọn)
      try {
        await deleteHandle(item.handleId);
      } catch {}
    }
    persist(allItems.filter((x) => x._id !== item._id));
  };

  // lưu (tạo/cập nhật) — chỉ metadata + handleId
  const handleSubmit = async () => {
    if (!form.title) return alert("Vui lòng nhập Tiêu đề");
    if (!form.type) return alert("Vui lòng chọn Loại");
    if (!form.security) return alert("Vui lòng chọn Mức bảo mật");
    if (!form.handleId) {
      // Cho phép lưu metadata trước, nhưng gợi ý chọn file để mở nhanh
      const confirmNoFile = confirm(
        "Bạn chưa gắn tệp cục bộ. Lưu metadata thôi?"
      );
      if (!confirmNoFile) return;
    }

    const baseDoc = {
      title: form.title,
      type: form.type,
      security: form.security,
      note: form.note || "",
      uploadedAt: form.uploadedAt || new Date().toISOString(),
      fileName: form.fileName || "",
      mime: form.mime || "",
      size: form.size ?? null,
      handleId: form.handleId, // tham chiếu tới IndexedDB
      soldierId,
    };

    if (form._id) {
      const next = allItems.map((x) =>
        x._id === form._id ? { ...x, ...baseDoc } : x
      );
      persist(next);
    } else {
      const newItem = { _id: `rf_${Date.now()}`, ...baseDoc };
      persist([newItem, ...allItems]);
    }

    setOpen(false);
    setForm({});
  };

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={1.5}
          mb={2}
        >
          <Typography variant="h6">
            Hồ sơ liên quan (metadata + liên kết tệp cục bộ)
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              size="small"
              placeholder="Tìm tiêu đề / ghi chú / tên file…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 260 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Loại</InputLabel>
              <Select
                label="Loại"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {DOC_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Mức bảo mật</InputLabel>
              <Select
                label="Mức bảo mật"
                value={secFilter}
                onChange={(e) => {
                  setSecFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {SECURITY_LEVELS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
            >
              Thêm metadata
            </Button>
          </Stack>
        </Stack>

        {/* Grid 6 thẻ/trang */}
        <Grid container spacing={2}>
          {paged.map((it) => (
            <Grid key={it._id} item xs={12} sm={6} md={4}>
              <FileCard
                item={it}
                onEdit={(x) => {
                  setForm(x);
                  setOpen(true);
                }}
                onDelete={handleDelete}
                onOpen={openLocalFile}
                onDownloadCopy={downloadCopy}
              />
            </Grid>
          ))}
          {paged.length === 0 && (
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
              >
                Không có hồ sơ phù hợp bộ lọc.
              </Typography>
            </Grid>
          )}
        </Grid>

        <TablePagination
          component="div"
          count={items.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={PAGE_SIZE}
          rowsPerPageOptions={[PAGE_SIZE]}
        />

        {/* Dialog tạo/sửa metadata */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {form._id ? "Cập nhật hồ sơ" : "Thêm hồ sơ (metadata)"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Tiêu đề"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                fullWidth
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Loại</InputLabel>
                  <Select
                    label="Loại"
                    value={form.type || "other"}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {DOC_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Mức bảo mật</InputLabel>
                  <Select
                    label="Mức bảo mật"
                    value={form.security || "internal"}
                    onChange={(e) =>
                      setForm({ ...form, security: e.target.value })
                    }
                  >
                    {SECURITY_LEVELS.map((s) => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <TextField
                label="Ghi chú"
                multiline
                minRows={2}
                value={form.note || ""}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                fullWidth
              />

              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <UploadFileIcon />
                  <Box flex={1}>
                    <Typography variant="subtitle2" mb={0.5}>
                      Liên kết tệp cục bộ
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Chọn tệp trên máy để tạo liên kết. Tệp **không** được tải
                      lên server. DB chỉ lưu tên + handleId (client).
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={attachLocalFileToForm}
                  >
                    Chọn tệp trên máy
                  </Button>
                </Stack>

                {joinNonEmpty([form.fileName, form.mime], " • ") && (
                  <Typography variant="caption" display="block" mt={1}>
                    {joinNonEmpty(
                      [
                        form.fileName,
                        form.mime,
                        form.size ? (form.size / 1024).toFixed(1) + " KB" : "",
                      ],
                      " • "
                    )}
                  </Typography>
                )}
                {form.handleId ? (
                  <Chip
                    size="small"
                    sx={{ mt: 1 }}
                    color="success"
                    label={`Đã liên kết • ${form.handleId}`}
                  />
                ) : (
                  <Chip size="small" sx={{ mt: 1 }} label="Chưa liên kết tệp" />
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
