import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function TrainingSearchBar({ value, onChange, placeholder = "Tìm kiếm huấn luyện theo tên..." }) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
