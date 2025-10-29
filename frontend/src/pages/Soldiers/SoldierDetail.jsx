import { Box, Chip, Container, Grid, Tab, Tabs, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import TabPanel from "@/components/common/TabPanel";
import SoldierHeader from "@/components/soldiers/SoldierHeader";
import BasicInfoSection from "@/components/soldiers/sections/BasicInfoSection";
import ContactSection from "@/components/soldiers/sections/ContactSection";
import FamilySection from "@/components/soldiers/sections/FamilySection";
import PartySection from "@/components/soldiers/sections/PartySection";
import ServiceHistorySection from "@/components/soldiers/sections/ServiceHistorySection";
import TrainingsSection from "@/components/soldiers/sections/TrainingsSection";
import AwardsDisciplineSection from "@/components/soldiers/sections/AwardsDisciplineSection";
import AttendanceSection from "@/components/soldiers/sections/AttendanceSection";
import DocumentsSection from "@/components/soldiers/sections/DocumentsSection";
import SectionCard from "@/components/common/SectionCard";
import { useState } from "react";
import useSoldier from "@/hooks/useSoldier";

export default function SoldierDetailPage() {
  const theme = useTheme();
  const { id = "68fb8438067657a0a1e2e328" } = useParams();
  const [tab, setTab] = useState(0);

  const { profile, loading, err } = useSoldier({ id });

  return (
    // <Box sx={{ bgcolor: theme.palette.grey[100], minHeight: "100vh", py: 3 }}>
    <Container maxWidth="xl" sx={{ pt: 3 }}>
      <SoldierHeader profile={profile} loading={loading} err={err} />
      <SectionCard
        title={
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab id="tab-0" label="Sơ yếu lý lịch" />
            <Tab id="tab-1" label="Quá trình Công tác" />
            <Tab id="tab-2" label="Đào tạo & Huấn luyện" />
            <Tab id="tab-3" label="Khen thưởng Kỷ luật" />
            <Tab id="tab-4" label="Lịch sử Chấm công" />
            <Tab id="tab-5" label="Giấy tờ liên quan" />
          </Tabs>
        }
      >
        <Box sx={{ maxHeight: "50vh", overflowY: "scroll" }}>
          <TabPanel value={tab} index={0}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <BasicInfoSection
                  data={profile.basic}
                  loading={loading}
                  err={err}
                />
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <FamilySection data={profile.family} err={err} />
              </Grid>
              {/* <Grid item xs={12}>
                <PartySection data={profile.party} err={err} />
              </Grid> */}
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <ServiceHistorySection items={profile.serviceHistory} />
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <TrainingsSection items={profile.trainings} />
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <AwardsDisciplineSection
              awards={profile.awards}
              disciplines={profile.disciplines}
            />
          </TabPanel>

          <TabPanel value={tab} index={4}>
            <AttendanceSection data={profile.attendance} />
          </TabPanel>

          <TabPanel value={tab} index={5}>
            <DocumentsSection items={profile.documents} />
          </TabPanel>
        </Box>
      </SectionCard>
    </Container>
  );
}
