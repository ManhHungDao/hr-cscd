// src/components/soldiers/AddSoldierFullModal.jsx
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import BasicInfo from "@components/soldiers/modals/BasicInfo";
import { useSoldiers } from "@/hooks/useSoldiers";

function a11yProps(index) {
  return {
    id: `soldier-tab-${index}`,
    "aria-controls": `soldier-tabpanel-${index}`,
  };
}

// chuyển file -> payload avatar base64
async function fileToAvatarPayload(file) {
  if (!file) return { name: "", data: "", contentType: "" };
  const buf = await file.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return {
    name: file.name,
    data: base64,
    contentType: file.type || "image/jpeg",
  };
}

// ----- FORM MẪU -----
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
    data: "",
    contentType: "",
  },
  notes: "",

  // 👨‍👩‍👧‍👦 Người thân
  familyMembers: [],
};

export default function AddSoldierFullModal({ open, onClose, onSaved }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(structuredClone(emptyForm));
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // lấy hàm create từ hook
  const { createSoldier } = useSoldiers();

  const canSubmit = useMemo(
    () => form.fullName.trim().length > 0,
    [form.fullName]
  );

  // set field đơn
  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  // set field lồng
  const setNested = (parent, key) => (e) =>
    setForm((s) => ({
      ...s,
      [parent]: { ...s[parent], [key]: e.target.value },
    }));

  const resetAll = () => {
    setForm(structuredClone(emptyForm));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setTab(0);
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!canSubmit) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        birthDate: form.birthDate || null,
        identity: {
          ...form.identity,
          cccdIssuedAt: form.identity?.cccdIssuedAt || null,
        },
        // familyMembers đã ở đúng dạng mảng rồi do BasicInfo chỉnh
      };

      // gọi API qua hook
      await createSoldier(payload);

      onSaved?.();
      resetAll();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi lưu hồ sơ chiến sĩ");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetAll();
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Thêm hồ sơ chiến sĩ</DialogTitle>

      <Box component="form" onSubmit={submit}>
        <DialogContent dividers sx={{ p: 0 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Soldier detail tabs"
            sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}
          >
            <Tab label="Sơ yếu lý lịch" {...a11yProps(0)} />
            <Tab label="Quá trình công tác" {...a11yProps(1)} />
            <Tab label="Đào tạo, huấn luyện" {...a11yProps(2)} />
            <Tab label="Khen thưởng, kỷ luật" {...a11yProps(3)} />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tab === 0 && (
              <BasicInfo
                form={form}
                set={set}
                setNested={setNested}
                previewUrl={previewUrl}
                setForm={setForm}
                setPreviewUrl={setPreviewUrl}
                fileToAvatarPayload={fileToAvatarPayload}
              />
            )}
            {tab === 1 && <PlaceholderTab title="Quá trình công tác" />}
            {tab === 2 && <PlaceholderTab title="Đào tạo, huấn luyện" />}
            {tab === 3 && <PlaceholderTab title="Khen thưởng, kỷ luật" />}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
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

function PlaceholderTab({ title }) {
  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 300,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Nội dung cho tab "{title}" chưa được triển khai.
      </Typography>
    </Box>
  );
}
