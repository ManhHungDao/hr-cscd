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
import SectionCard from "@/components/common/SectionCard";
import { useState, useMemo } from "react";
import { useFetchSoldier } from "@/hooks/useSoldier";

function a11yProps(index) {
  return {
    id: `soldier-tab-${index}`,
    "aria-controls": `soldier-tabpanel-${index}`,
  };
}

export default function SoldierDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const { profile, loading, err } = useFetchSoldier({ id });

  // Tránh crash khi profile chưa sẵn sàng
  const p = useMemo(() => profile ?? {}, [profile]);
  const safeArr = (arr) => (Array.isArray(arr) ? arr : []);

  return (
    <Container maxWidth="xl" sx={{ pt: 3 }}>
      <SoldierHeader profile={p} loading={loading} err={err} />

      <SectionCard
        title={
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Soldier detail tabs"
          >
            <Tab label="Sơ yếu lý lịch" {...a11yProps(0)} />
            <Tab label="Quá trình Công tác" {...a11yProps(1)} />
            <Tab label="Đào tạo & Huấn luyện" {...a11yProps(2)} />
            <Tab label="Khen thưởng Kỷ luật" {...a11yProps(3)} />
            <Tab label="Lịch sử Chấm công" {...a11yProps(4)} />
            <Tab label="Giấy tờ liên quan" {...a11yProps(5)} />
          </Tabs>
        }
      >
        {/* Nếu đang tải, có thể show skeleton đơn giản */}
        {loading ? (
          <Box sx={{ p: 2 }}>Đang tải dữ liệu…</Box>
        ) : err ? (
          <Box sx={{ p: 2, color: "error.main" }}>
            Có lỗi khi tải dữ liệu: {String(err)}
          </Box>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <TabPanel
              value={tab}
              index={0}
              id="soldier-tabpanel-0"
              ariaLabelledby="soldier-tab-0"
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <BasicInfoSection
                    data={p.basic ?? {}}
                    loading={false}
                    err={null}
                  />
                </Grid>

                {/* Có thể thêm ContactSection/PartySection khi cần */}
                <Grid item xs={12}>
                  <FamilySection
                    data={p.family ?? { members: [] }}
                    err={null}
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <PartySection data={p.party ?? {}} err={null} />
                </Grid> */}
              </Grid>
            </TabPanel>

            <TabPanel
              value={tab}
              index={1}
              id="soldier-tabpanel-1"
              ariaLabelledby="soldier-tab-1"
            >
              <ServiceHistorySection items={safeArr(p.serviceHistory)} />
            </TabPanel>

            <TabPanel
              value={tab}
              index={2}
              id="soldier-tabpanel-2"
              ariaLabelledby="soldier-tab-2"
            >
              <TrainingsSection items={safeArr(p.trainings)} />
            </TabPanel>

            <TabPanel
              value={tab}
              index={3}
              id="soldier-tabpanel-3"
              ariaLabelledby="soldier-tab-3"
            >
              <AwardsDisciplineSection
                awards={safeArr(p.awards)}
                disciplines={safeArr(p.disciplines)}
              />
            </TabPanel>

            <TabPanel
              value={tab}
              index={4}
              id="soldier-tabpanel-4"
              ariaLabelledby="soldier-tab-4"
            >
              <AttendanceSection data={safeArr(p.attendance)} />
            </TabPanel>

            <TabPanel
              value={tab}
              index={5}
              id="soldier-tabpanel-5"
              ariaLabelledby="soldier-tab-5"
            >
              <DocumentsSection items={safeArr(p.documents)} />
            </TabPanel>
          </Box>
        )}
      </SectionCard>
    </Container>
  );
}
