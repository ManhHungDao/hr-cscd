import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AvatarUpload = ({ previewUrl, onPickAvatar }) => (
  <Stack
    spacing={2}
    direction="row"
    alignItems="center"
    justifyContent="center"
    sx={{ height: "100%" }}
  >
    <Button
      component="label"
      sx={{
        padding: 0,
        minWidth: 90,
        height: 90,
        borderRadius: "50%",
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Avatar
        src={previewUrl}
        sx={{
          width: 90,
          height: 90,
          mb: 1,
          border: "1px solid #ddd",
          cursor: "pointer",
        }}
      />
      <input hidden type="file" accept="image/*" onChange={onPickAvatar} />
    </Button>
  </Stack>
);

export default function BasicInfo({
  form,
  set,
  setNested,
  previewUrl,
  setForm,
}) {
  const GENDERS = ["Nam", "Nữ", "Khác"];
  const BLOOD_TYPES = ["A", "B", "AB", "O", "Chưa biết"];
  const MARITAL = ["Độc thân", "Kết hôn", "Khác"];
  const RELATION = ["Bố", "Mẹ", "Anh", "Chị", "Em", "Vợ", "Chồng", "Con"];

  // object mẫu cho 1 người thân
  const EMPTY_FAMILY = {
    relation: "",
    fullName: "",
    gender: "",
    birthDate: "",
    phone: "",
    occupation: "",
    hometown: "",
    permanentAddress: "",
  };

  const handlePickAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // phần này bạn đã có logic riêng, giữ nguyên
  };

  // thêm người thân
  const handleAddFamily = () => {
    setForm((prev) => ({
      ...prev,
      familyMembers: [...(prev.familyMembers || []), { ...EMPTY_FAMILY }],
    }));
  };

  // đổi dữ liệu 1 người thân
  const handleFamilyChange = (index, field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = [...(prev.familyMembers || [])];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, familyMembers: next };
    });
  };

  // xoá 1 người thân
  const handleRemoveFamily = (index) => () => {
    setForm((prev) => {
      const next = [...(prev.familyMembers || [])];
      next.splice(index, 1);
      return { ...prev, familyMembers: next };
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* --------- PHẦN THÔNG TIN CƠ BẢN CỦA CHIẾN SĨ (giữ nguyên của bạn) --------- */}
        <Grid item xs={12} md={3}>
          <AvatarUpload
            previewUrl={previewUrl}
            onPickAvatar={handlePickAvatar}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Họ và tên"
                value={form.fullName}
                onChange={set("fullName")}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <TextField
                label="Ngày sinh"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.birthDate}
                onChange={set("birthDate")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <TextField
                label="Tôn giáo"
                value={form.religion}
                onChange={set("religion")}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Số CCCD"
            value={form.identity?.cccd || ""}
            onChange={setNested("identity", "cccd")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Ngày cấp"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.identity?.cccdIssuedAt || ""}
            onChange={setNested("identity", "cccdIssuedAt")}
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
            type="email"
            value={form.email}
            onChange={set("email")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Nơi sinh"
            value={form.birthPlace}
            onChange={set("birthPlace")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Quê quán"
            value={form.hometown}
            onChange={set("hometown")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Địa chỉ thường trú"
            value={form.permanentAddress}
            onChange={set("permanentAddress")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Ghi chú"
            value={form.notes}
            onChange={set("notes")}
            fullWidth
            multiline
            minRows={3}
          />
        </Grid>

        {/* --------- PHẦN THÔNG TIN NGƯỜI THÂN --------- */}
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Thông tin người thân
            </Typography>
            <Button variant="outlined" onClick={handleAddFamily}>
              Thêm thành viên gia đình
            </Button>
          </Stack>
        </Grid>

        {(form.familyMembers || []).map((member, idx) => (
          <Grid key={idx} item xs={12} container spacing={2}>
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Mối quan hệ"
                value={member.relation}
                onChange={handleFamilyChange(idx, "relation")}
                fullWidth
              >
                {RELATION.map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Họ và tên"
                value={member.fullName}
                onChange={handleFamilyChange(idx, "fullName")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Ngày sinh"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={member.birthDate}
                onChange={handleFamilyChange(idx, "birthDate")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="SĐT"
                value={member.phone}
                onChange={handleFamilyChange(idx, "phone")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Nghề nghiệp"
                value={member.occupation}
                onChange={handleFamilyChange(idx, "address")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                label="Quê quán"
                value={member.hometown}
                onChange={handleFamilyChange(idx, "address")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Địa chỉ thường trú"
                value={member.permanentAddress}
                onChange={handleFamilyChange(idx, "address")}
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={1}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <IconButton color="error" onClick={handleRemoveFamily(idx)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
