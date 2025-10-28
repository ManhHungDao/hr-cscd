import { Box } from "@mui/material";

export default function TabPanel({ value, index, children }) {
  return (
    <div role="tabpanel" hidden={value !== index} aria-labelledby={`tab-${index}`}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}
