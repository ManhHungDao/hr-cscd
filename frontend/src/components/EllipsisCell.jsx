import { Tooltip, Typography } from "@mui/material";

export default function EllipsisCell({
  text = "",
  width = 160,
  align = "left",
}) {
  return (
    <Tooltip title={text || ""} arrow>
      <Typography
        align={align}
        noWrap
        sx={{
          maxWidth: width,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "block",
        }}
      >
        {text || "-"}
      </Typography>
    </Tooltip>
  );
}
