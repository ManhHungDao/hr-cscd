import { useEffect, useState } from "react";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function ListSoldiers() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/soldiers");
        setRows(res.data.data.map((x, i) => ({ id: x._id, ...x })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const columns = [
    { field: "code", headerName: "Mã", width: 120 },
    { field: "name", headerName: "Họ tên", flex: 1 },
    { field: "rank", headerName: "Cấp bậc", width: 140 }
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <h2>Danh sách Cán bộ/Chiến sĩ</h2>
        <Button component={Link} to="/soldiers/new" variant="contained">Thêm mới</Button>
      </Stack>
      <div style={{ height: 520, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[10, 25, 50]} />
      </div>
    </Box>
  );
}
