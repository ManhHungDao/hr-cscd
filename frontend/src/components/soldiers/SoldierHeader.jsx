import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

export default function SoldierHeader({ profile, loading, err }) {
  const navigate = useNavigate();
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
        mb: 2,
        background: "linear-gradient(180deg,#fff,#fafafa)",
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton color="inherit" size="small" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>

          <Avatar
            src={profile.avatar}
            sx={{
              width: 76,
              height: 76,
              border: "3px solid #fff",
              boxShadow: 1,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography fontWeight={900} fontSize={22} lineHeight={1.2}>
              {loading ? "Đang tải..." : profile.name || "(Không tên)"}
            </Typography>

            {err ? (
              <Typography color="error" variant="body2">
                Lỗi tải hồ sơ: {err}
              </Typography>
            ) : (
              <>
                <Typography color="text.secondary" variant="body2">
                  Cấp bậc: <b>{profile.rank}</b> &nbsp;•&nbsp; Chức vụ:{" "}
                  <b>{profile.position}</b>
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Số hiệu CAND: <b>{profile.code}</b>
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {profile.unitLine}
                </Typography>
              </>
            )}
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              disabled={!!err || loading}
            >
              Sửa hồ sơ
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              disabled={!!err || loading}
            >
              In Sơ yếu công tác
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
