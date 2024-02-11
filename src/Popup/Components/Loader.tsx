import { Box, CircularProgress } from "@mui/material";

export default function () {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "300px",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
