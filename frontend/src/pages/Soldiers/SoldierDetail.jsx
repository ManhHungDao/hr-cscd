import { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Container, Grid, Tab, Tabs } from "@mui/material";
import { useParams } from "react-router-dom";

import TabPanel from "@/components/common/TabPanel";
import SoldierHeader from "@/components/soldiers/SoldierHeader";
import BasicInfoSection from "@/components/soldiers/sections/BasicInfoSection";
import FamilySection from "@/components/soldiers/sections/FamilySection";
// import PartySection from "@/components/soldiers/sections/PartySection";
import ServiceHistorySection from "@/components/soldiers/sections/ServiceHistorySection";
import TrainingsSection from "@/components/soldiers/sections/TrainingsSection";
import AwardsDisciplineSection from "@/components/soldiers/sections/AwardsDisciplineSection";
import AttendanceSection from "@/components/soldiers/sections/AttendanceSection";
import DocumentsSection from "@/components/soldiers/sections/DocumentsSection";

import { useSoldiers } from "@/hooks/useSoldiers";

function a11yProps(index) {
  return {
    id: `soldier-tab-${index}`,
    "aria-controls": `soldier-tabpanel-${index}`,
  };
}

export default function SoldierDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const { raw, loading, error, fetchOne } = useSoldiers();

  // Tải 1 hồ sơ theo id
  useEffect(() => {
    if (id) fetchOne(id).catch(() => {});
  }, [id, fetchOne]);

  const p = useMemo(() => raw ?? {}, [raw]);
  const err = error;

  const safeArr = useCallback((arr) => (Array.isArray(arr) ? arr : []), []);

  // Convert Buffer -> object URL hoặc data URL cho Avatar + map sang ViewModel của Header
  const headerData = useMemo(() => {
    let avatarUrl;
    const av = p && p.avatar;

    // Ưu tiên tạo object URL để tiết kiệm bộ nhớ; nếu lỗi thì thử data URL base64
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
        // bỏ qua, để avatar undefined
      }
    }

    return {
      name: (p && p.fullName) || "(Không tên)",
      avatar: avatarUrl,
      rank: (p && p.rank) || "",
      position: (p && p.position) || "",
      code: (p && p.code) || (p && p.identity && p.identity.cccd) || "",
      unitLine: (p && p.unitLine) || (p && p.currentAddress) || "",
    };
  }, [p]);

  // Thu hồi object URL khi đổi hồ sơ hoặc unmount để tránh leak
  useEffect(() => {
    return () => {
      if (
        headerData &&
        headerData.avatar &&
        headerData.avatar.startsWith("blob:")
      ) {
        try {
          URL.revokeObjectURL(headerData.avatar);
        } catch {}
      }
    };
  }, [headerData && headerData.avatar]);

  return (
    <Container maxWidth="xl" sx={{ pt: 3 }}>
      <SoldierHeader profile={headerData} loading={loading} err={err} />

      <Box
        sx={{
          mt: 2,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
          background: "linear-gradient(180deg,#fff,#fafafa)",
        }}
      >
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

        {/* Nội dung các tab */}
        {loading ? (
          <Box sx={{ p: 2 }}>Đang tải dữ liệu…</Box>
        ) : err ? (
          <Box sx={{ p: 2, color: "error.main" }}>
            Có lỗi khi tải dữ liệu: {String(err)}
          </Box>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto", p: 2 }}>
            <TabPanel
              value={tab}
              index={0}
              id="soldier-tabpanel-0"
              ariaLabelledby="soldier-tab-0"
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  {/* 👉 Truyền dữ liệu gốc từ server */}
                  <BasicInfoSection data={p} loading={loading} err={err} />
                </Grid>

                <Grid item xs={12}>
                  <FamilySection
                    data={(p && p.family) || { members: [] }}
                    err={null}
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <PartySection data={(p && p.party) || {}} err={null} />
                </Grid> */}
              </Grid>
            </TabPanel>

            <TabPanel
              value={tab}
              index={1}
              id="soldier-tabpanel-1"
              ariaLabelledby="soldier-tab-1"
            >
              <ServiceHistorySection items={safeArr(p && p.serviceHistory)} />
            </TabPanel>

            <TabPanel
              value={tab}
              index={2}
              id="soldier-tabpanel-2"
              ariaLabelledby="soldier-tab-2"
            >
              <TrainingsSection items={safeArr(p && p.trainings)} />
            </TabPanel>

            <TabPanel
              value={tab}
              index={3}
              id="soldier-tabpanel-3"
              ariaLabelledby="soldier-tab-3"
            >
              <AwardsDisciplineSection
                awards={safeArr(p && p.awards)}
                disciplines={safeArr(p && p.disciplines)}
              />
            </TabPanel>

            <TabPanel
              value={tab}
              index={4}
              id="soldier-tabpanel-4"
              ariaLabelledby="soldier-tab-4"
            >
              <AttendanceSection data={safeArr(p && p.attendance)} />
            </TabPanel>

            <TabPanel
              value={tab}
              index={5}
              id="soldier-tabpanel-5"
              ariaLabelledby="soldier-tab-5"
            >
              <DocumentsSection items={safeArr(p && p.documents)} />
            </TabPanel>
          </Box>
        )}
      </Box>
    </Container>
  );
}
