import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header = ({ title }) => {
  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        backgroundColor: "rgba(31, 41, 55, 0.5)", // tương đương bg-gray-800 bg-opacity-50
        backdropFilter: "blur(8px)", // tương đương backdrop-blur-md
        borderBottom: "1px solid rgba(55, 65, 81, 1)", // border-gray-700
      }}
    >
      <Toolbar>
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            px: { xs: 2, sm: 3, lg: 4 },
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 600,
              color: "rgba(243, 244, 246, 1)", // text-gray-100
            }}
          >
            {title}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
