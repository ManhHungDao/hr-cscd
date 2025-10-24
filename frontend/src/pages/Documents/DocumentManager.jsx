import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
  TablePagination,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DocumentFilters from "@/components/docs/DocumentFilters";
import DocumentTable from "@/components/docs/DocumentTable";
import DocumentDetailDrawer from "@/components/docs/DocumentDetailDrawer";
import DocumentUploadDialog from "@/components/docs/DocumentUploadDialog";
import { MOCK_DOCUMENTS } from "@/data/mockDocuments";

export default function DocumentManagerPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [security, setSecurity] = useState("");
  const [rows, setRows] = useState(MOCK_DOCUMENTS);
  const [preview, setPreview] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);

  // Phân trang kiểu Inventory
  const [page, setPage] = useState(0); // 0-based
  const [rowsPerPage, setRowsPerPage] = useState(6);

  // Reset trang khi thay đổi bộ lọc/tìm kiếm
  useEffect(() => {
    setPage(0);
  }, [query, type, security]);

  const filtered = useMemo(() => {
    let data = [...rows];

    if (query) {
      const q = query.toLowerCase();
      data = data.filter(
        (r) =>
          (r.name || "").toLowerCase().includes(q) ||
          (r.id || "").toLowerCase().includes(q) ||
          (r.owner || "").toLowerCase().includes(q) ||
          (r.notes || "").toLowerCase().includes(q)
      );
    }
    if (type) data = data.filter((r) => r.type === type);
    if (security) data = data.filter((r) => r.security === security);

    // sort by updatedAt desc
    data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return data;
  }, [rows, query, type, security]);

  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const reset = () => {
    setQuery("");
    setType("");
    setSecurity("");
    setPage(0);
  };

  const createDoc = (doc) => setRows((prev) => [doc, ...prev]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={700}>
          Quản lý văn bản
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => setOpenUpload(true)}
          >
            Tải lên
          </Button>
        </Stack>
      </Stack>

      <Card
        sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}
      >
        <CardContent>
          {/* Bộ lọc */}
          <DocumentFilters
            query={query}
            setQuery={setQuery}
            type={type}
            setType={setType}
            security={security}
            setSecurity={setSecurity}
            onReset={reset}
          />

          {/* Bảng với ellipsis + tooltip + fixed layout */}
          <DocumentTable rows={paged} onPreview={setPreview} />

          {/* Phân trang kiểu Inventory */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[6, 15, 25, 50]}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Drawer xem chi tiết */}
      <DocumentDetailDrawer
        open={!!preview}
        onClose={() => setPreview(null)}
        doc={preview}
      />

      {/* Dialog upload */}
      <DocumentUploadDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onCreate={createDoc}
      />
    </Container>
  );
}
