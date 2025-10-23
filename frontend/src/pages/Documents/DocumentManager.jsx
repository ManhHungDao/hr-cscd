// src/pages/Documents/DocumentManager.jsx
import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Pagination,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FilterListIcon from "@mui/icons-material/FilterList";
import DocumentFilters from "@/components/docs/DocumentFilters";
import DocumentTable from "@/components/docs/DocumentTable";
import DocumentDetailDrawer from "@/components/docs/DocumentDetailDrawer";
import DocumentUploadDialog from "@/components/docs/DocumentUploadDialog";
import { MOCK_DOCUMENTS } from "@/data/mockDocuments";

const PAGE_SIZE = 6;

export default function DocumentManagerPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [security, setSecurity] = useState("");
  const [rows, setRows] = useState(MOCK_DOCUMENTS);
  const [preview, setPreview] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [page, setPage] = useState(1);

  // Reset trang khi thay đổi bộ lọc
  useEffect(() => {
    setPage(1);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const currentPageRows = useMemo(
    () => filtered.slice(start, start + PAGE_SIZE),
    [filtered, start]
  );

  const reset = () => {
    setQuery("");
    setType("");
    setSecurity("");
    setPage(1);
  };

  const createDoc = (doc) => setRows((prev) => [doc, ...prev]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
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
          <DocumentFilters
            query={query}
            setQuery={setQuery}
            type={type}
            setType={setType}
            security={security}
            setSecurity={setSecurity}
            onReset={reset}
          />
          <DocumentTable rows={currentPageRows} onPreview={setPreview} />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              siblingCount={0}
              boundaryCount={1}
              showFirstButton
              showLastButton
            />
          </Box>
        </CardContent>
      </Card>

      <DocumentDetailDrawer
        open={!!preview}
        onClose={() => setPreview(null)}
        doc={preview}
      />
      <DocumentUploadDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onCreate={createDoc}
      />
    </Container>
  );
}
