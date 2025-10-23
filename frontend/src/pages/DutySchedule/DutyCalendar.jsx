import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import vi from "date-fns/locale/vi";

export default function DutyCalendar({ selectedDate, onSelectDate }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <DateCalendar
        value={selectedDate}
        onChange={onSelectDate}
        views={["day"]}
      />
    </LocalizationProvider>
  );
}
