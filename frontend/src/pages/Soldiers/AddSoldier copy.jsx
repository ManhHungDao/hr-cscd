// src/components/soldiers/AddSoldierFullModal.jsx
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Avatar,
  Divider,
  Container,
} from "@mui/material";
import { useMemo, useState } from "react";
import api from "../../services/api";

const GENDERS = ["Nam", "Nữ", "Khác"];
const BLOOD_TYPES = ["A", "B", "AB", "O", "Chưa biết"];
const MARITAL = ["Độc thân", "Kết hôn", "Khác"];

const emptyForm = {
  // 🧍‍♂️ Thông tin cơ bản
  fullName: "",
  gender: "Nam",
  birthDate: "",
  birthPlace: "",
  hometown: "",

  // 🏠 Địa chỉ
  permanentAddress: "",
  currentAddress: "",

  // 🪪 Định danh
  identity: {
    cccd: "",
    cccdIssuedAt: "",
    cccdIssuedPlace: "",
  },

  // 💉 Sức khỏe
  bloodType: "Chưa biết",

  // 🕊️ Tôn giáo, hôn nhân
  religion: "",
  maritalStatus: "Độc thân",

  // 📞 Liên lạc
  email: "",
  phone: "",

  // 🖼️ Ảnh và ghi chú
  avatar: {
    name: "",
    data: "", // base64 (không kèm prefix)
    contentType: "", // ví dụ "image/jpeg"
  },
  notes: "",
};
function a11yProps(index) {
  return {
    id: `soldier-tab-${index}`,
    "aria-controls": `soldier-tabpanel-${index}`,
  };
}
async function fileToAvatarPayload(file) {
  if (!file) return { name: "", data: "", contentType: "" };
  const buf = await file.arrayBuffer();
  // chuyển sang base64 “thuần” (server có thể Buffer.from(base64,"base64"))
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return {
    name: file.name,
    data: base64,
    contentType: file.type || "application/octet-stream",
  };
}

export default function AddSoldierFullModal({ open, onClose, onSaved }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(structuredClone(emptyForm));
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const canSubmit = useMemo(
    () => form.fullName.trim().length > 0,
    [form.fullName]
  );

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  const setNested = (parent, key) => (e) =>
    setForm((s) => ({
      ...s,
      [parent]: { ...s[parent], [key]: e.target.value },
    }));

  const handlePickAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    const avatar = await fileToAvatarPayload(file);
    setForm((s) => ({ ...s, avatar }));
  };

  const resetAll = () => {
    setForm(structuredClone(emptyForm));
    setPreviewUrl("");
    setTab(0);
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!canSubmit) return;

    setLoading(true);
    try {
      // Chuyển các trường date từ "" => null (để backend mongo nhận chuẩn)
      const payload = {
        ...form,
        birthDate: form.birthDate || null,
        identity: {
          ...form.identity,
          cccdIssuedAt: form.identity.cccdIssuedAt || null,
        },
      };

      await api.post("/soldiers", payload);
      onSaved?.();
      resetAll();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu hồ sơ chiến sĩ");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetAll();
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>Thêm hồ sơ</DialogTitle>

      <Box component="form" onSubmit={submit}>
        <DialogContent dividers>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Soldier detail tabs"
          >
            <Tab label="Sơ yếu lý lịch" {...a11yProps(0)} />
            <Tab label="Quá trình công tác" {...a11yProps(1)} />
            <Tab label="Đào tạo, huấn luyện" {...a11yProps(2)} />
            <Tab label="Khen thưởng, kỷ luật" {...a11yProps(3)} />
            <Tab label="Lịch sử chấm công" {...a11yProps(4)} />
            <Tab label="Giấy tờ liên quan" {...a11yProps(5)} />
          </Tabs>
          {/* CƠ BẢN */}
          {tab === 0 && (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid
                  item
                  container // <-- Thêm prop này
                  xs={12}
                  md={12}
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={previewUrl} sx={{ width: 72, height: 72 }} />
                    <Button variant="outlined" component="label">
                      Chọn ảnh đại diện
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handlePickAvatar}
                      />
                    </Button>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Họ và tên"
                    value={form.fullName}
                    onChange={set("fullName")}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    label="Giới tính"
                    value={form.gender}
                    onChange={set("gender")}
                    fullWidth
                  >
                    {GENDERS.map((x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Ngày sinh"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.birthDate}
                    onChange={set("birthDate")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Số CCCD"
                    value={form.identity.cccd}
                    onChange={setNested("identity", "cccd")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    select
                    label="Nhóm máu"
                    value={form.bloodType}
                    onChange={set("bloodType")}
                    fullWidth
                  >
                    {BLOOD_TYPES.map((x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    select
                    label="Tình trạng hôn nhân"
                    value={form.maritalStatus}
                    onChange={set("maritalStatus")}
                    fullWidth
                  >
                    {MARITAL.map((x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    label="Tôn giáo"
                    value={form.phone}
                    onChange={set("phone")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Số điện thoại"
                    value={form.phone}
                    onChange={set("phone")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Email"
                    value={form.email}
                    onChange={set("email")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nơi sinh"
                    value={form.birthPlace}
                    onChange={set("birthPlace")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Quê quán"
                    value={form.hometown}
                    onChange={set("hometown")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Địa chỉ thường trú"
                    value={form.permanentAddress}
                    onChange={set("permanentAddress")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Địa chỉ hiện tại"
                    value={form.currentAddress}
                    onChange={set("currentAddress")}
                    fullWidth
                    // multiline
                    // minRows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Ghi chú"
                    value={form.notes}
                    onChange={set("notes")}
                    fullWidth
                    multiline
                    minRows={4}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit || loading}
          >
            {loading ? "Đang lưu..." : "Lưu hồ sơ"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
