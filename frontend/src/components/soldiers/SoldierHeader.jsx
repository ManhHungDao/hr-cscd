import { useMemo, useEffect } from "react";
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
// import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

export default function SoldierHeader({ profile, loading, err }) {
  const navigate = useNavigate();

  // B1: ổn định dữ liệu gốc
  const p = useMemo(() => profile ?? {}, [profile]);

  // B2: tạo avatarUrl từ Buffer hoặc data URL (nếu cần)
  const header = useMemo(() => {
    let avatarUrl;
    const av = p && p.avatar;

    try {
      if (av && av.data && av.data.data && av.data.data.length) {
        const bytes = new Uint8Array(av.data.data);
        const blob = new Blob([bytes], { type: av.contentType || "image/*" });
        avatarUrl = URL.createObjectURL(blob);
      }
    } catch (_) {
      try {
        if (av && av.data && av.data.data && av.data.data.length) {
          const bin = String.fromCharCode(...new Uint8Array(av.data.data));
          const b64 = typeof btoa !== "undefined" ? btoa(bin) : "";
          avatarUrl = `data:${
            (av && av.contentType) || "image/*"
          };base64,${b64}`;
        }
      } catch {
        // Không set avatarUrl nếu lỗi
      }
    }

    return {
      name: p.fullName || "(Không tên)",
      avatar: avatarUrl,
      rank: p.rank || "",
      position: p.position || "",
      code: p.code || (p.identity && p.identity.cccd) || "",
      unitLine: p.unitLine || p.currentAddress || "",
    };
  }, [p]);

  // B3: thu hồi object URL khi đổi avatar hoặc unmount
  useEffect(() => {
    const url = header?.avatar;
    return () => {
      if (url && url.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }
    };
  }, [header?.avatar]);

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
            src={header.avatar}
            alt={header.name || "avatar"}
            sx={{
              width: 76,
              height: 76,
              border: "3px solid #fff",
              boxShadow: 1,
            }}
          />

          <Box sx={{ flexGrow: 1 }}>
            <Typography fontWeight={900} fontSize={22} lineHeight={1.2}>
              {loading ? "Đang tải..." : header.name}
            </Typography>

            {err ? (
              <Typography color="error" variant="body2">
                Lỗi tải hồ sơ: {String(err)}
              </Typography>
            ) : (
              <>
                <Typography color="text.secondary" variant="body2">
                  Cấp bậc: <b>{header.rank}</b> &nbsp;•&nbsp; Chức vụ:{" "}
                  <b>{header.position}</b>
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Số hiệu CAND: <b>{header.code}</b>
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {header.unitLine}
                </Typography>
              </>
            )}
          </Box>

          <Stack direction="row" spacing={1}>
            {/* <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              disabled={!!err || loading}
            >
              Sửa hồ sơ
            </Button> */}
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              disabled={!!err || loading}
              onClick={() => window.print()}
            >
              In thông tin
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
