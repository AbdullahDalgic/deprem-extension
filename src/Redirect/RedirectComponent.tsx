import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CssBaseline,
  LinearProgress,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { i18n } from "@src/tools/helpers";
import { useEffect } from "react";

export default function () {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");

  useEffect(() => {
    if (redirect) {
      setTimeout(() => {
        chrome.tabs.update({
          url: redirect,
        });
      }, 2000);
    }
  }, [redirect]);

  if (!redirect) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <CssBaseline />

      <Card sx={{ maxWidth: 345, bgcolor: grey[100] }}>
        <CardActionArea>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <CardMedia
              component="img"
              height={"50px"}
              image={chrome.runtime.getURL("assets/icon.png")}
              sx={{ objectFit: "contain", width: "auto!important" }}
              alt="Deprem Wiki Logo"
            />

            <Typography variant="h5">Deprem Wiki</Typography>
          </Box>
          <CardContent sx={{ bgcolor: "#fff", marginY: "10px" }}>
            <Typography gutterBottom variant="h5" component="div">
              {i18n("redirect_title")}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {i18n("redirect_message")}
            </Typography>
          </CardContent>

          <LinearProgress color="secondary" />
        </CardActionArea>
      </Card>
    </Box>
  );
}
