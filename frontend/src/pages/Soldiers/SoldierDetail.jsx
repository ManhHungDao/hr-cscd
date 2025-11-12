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

  useEffect(() => {
    if (id) fetchOne(id).catch(() => {});
  }, [id, fetchOne]);

  const p = useMemo(() => raw ?? {}, [raw]);

  // Nếu FamilySection mong chờ { members: [...] }
  const familyData = useMemo(() => {
    if (p && p.family && Array.isArray(p.family.members)) return p.family;
    if (Array.isArray(p?.familyMembers)) return { members: p.familyMembers };
    return { members: [] };
  }, [p]);

  const safeArr = (arr) => (Array.isArray(arr) ? arr : []);

  return (
    <Container maxWidth="xl" sx={{ pt: 3 }}>
      <SoldierHeader profile={p} loading={loading} err={error} />

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

        {loading ? (
          <Box sx={{ p: 2 }}>Đang tải dữ liệu…</Box>
        ) : error ? (
          <Box sx={{ p: 2, color: "error.main" }}>
            Có lỗi khi tải dữ liệu: {String(error)}
          </Box>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto", p: 2 }}>
            <TabPanel
              value={tab}
              index={0}
              id="soldier-tabpanel-0"
              ariaLabelledby="soldier-tab-0" // đảm bảo TabPanel dùng đúng prop này
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  {/* BasicInfoSection tự flatten nội dung → truyền p là đủ */}
                  <BasicInfoSection data={p} loading={false} err={null} />
                </Grid>

                <Grid item xs={12}>
                  <FamilySection
                    data={{ members: p.familyMembers || [] }}
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
