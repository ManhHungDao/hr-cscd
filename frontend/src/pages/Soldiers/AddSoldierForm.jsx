import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddSoldierForm(){
  const [form, setForm] = useState({ code:"", name:"", rank:"Chiến sĩ" });
  const navigate = useNavigate();
  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/soldiers", form);
      navigate("/soldiers");
    } catch (e) { alert("Lỗi lưu"); }
  };
  return (
    <Box className="card" component="form" onSubmit={submit}>
      <Stack spacing={2}>
        <TextField label="Mã" value={form.code} onChange={change("code")} />
        <TextField label="Họ tên" value={form.name} onChange={change("name")} />
        <TextField select label="Cấp bậc" value={form.rank} onChange={change("rank")}>
          {["Chiến sĩ","Hạ sĩ","Trung sĩ","Thượng sĩ","Thiếu úy","Trung úy","Thượng úy","Đại úy"].map(x=>(
            <MenuItem key={x} value={x}>{x}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained">Lưu</Button>
      </Stack>
    </Box>
  );
}
