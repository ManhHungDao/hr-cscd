import  { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DutyCalendar from "./DutyCalendar";
import DutyTable from "./DutyTable";
import DutyDialog from "./DutyDialog";
import { sampleDutyData } from "./data/sampleDutyData";

export default function DutySchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duties, setDuties] = useState(sampleDutyData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDuty, setEditDuty] = useState(null);

  const handleSave = (newDuty) => {
    if (editDuty) {
      setDuties((prev) =>
        prev.map((d) => (d.id === editDuty.id ? newDuty : d))
      );
    } else {
      setDuties((prev) => [...prev, { ...newDuty, id: Date.now() }]);
    }
    setOpenDialog(false);
    setEditDuty(null);
  };

  const handleEdit = (duty) => {
    setEditDuty(duty);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setDuties((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        📅 Quản lý lịch trực
      </Typography>

      <Stack direction="row" spacing={3}>
        {/* Lịch tháng */}
        <Box flex={1.2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <DutyCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Bảng ca trực */}
        <Box flex={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6">
                  Ca trực ngày{" "}
                  {selectedDate.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={() => setOpenDialog(true)}
                >
                  Thêm lịch trực
                </Button>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <DutyTable
                date={selectedDate}
                duties={duties.filter(
                  (d) =>
                    new Date(d.date).toDateString() ===
                    selectedDate.toDateString()
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </Box>
      </Stack>

      <DutyDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditDuty(null);
        }}
        onSave={handleSave}
        editDuty={editDuty}
      />
    </Box>
  );
}
