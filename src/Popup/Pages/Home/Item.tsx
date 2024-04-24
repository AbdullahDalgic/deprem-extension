import { memo } from "react";
import {
  Box,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { green, yellow, orange, red, grey } from "@mui/material/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CellTowerIcon from "@mui/icons-material/CellTower";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import moment from "moment";
import { IEarthquake } from "@src/tools/redux/slices/earthquakes";
import { dateConvert, i18n } from "@src/tools/helpers";

const Items = memo(
  ({ data }: { data: IEarthquake }) => {
    console.log("🚀 ~ item:", data);

    return (
      <ListItem className={`list-item ${!data.seen ? "unseen" : ""}`}>
        <ListItemAvatar>
          <Avatar
            sx={[
              magnitudeStyle(data.magnitude),
              {
                fontWeight: "bold",
                borderRadius: "20%",
              },
            ]}
          >
            {data.magnitude}
          </Avatar>
        </ListItemAvatar>
        <Box style={{ width: '100%' }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            fontWeight={"600"}
            fontSize={13}
          >
            {data.location}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
            }}
          >
            <Box justifyContent={"start"} display={"flex"}>
              <AccessTimeIcon
                style={{
                  fontSize: "15px",
                  marginRight: "2px",
                }}
              />
              <Typography variant="caption" marginRight={2}>
                {i18n("TSI")} : {data.eventDate}
              </Typography>
            </Box>

            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <Box justifyContent={"center"} display={"flex"}>
                <HourglassEmptyIcon
                  style={{
                    fontSize: "15px",
                    marginRight: "2px",
                  }}
                />
                <Typography variant="caption" marginRight={2}>
                  {moment(dateConvert(data.eventDate, data.timezone)).fromNow()}
                </Typography>
              </Box>

              {data.location && data.location !== "" && (
                <Box justifyContent={"center"} display={"flex"}>
                  <CellTowerIcon
                    style={{
                      fontSize: "15px",
                      marginRight: "2px",
                    }}
                  />
                  <Typography variant="caption" marginRight={2}>
                    {data.provider}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <ListItemAvatar
          sx={{ textAlign: "-webkit-right", cursor: "pointer" }}
          onClick={() => { }}
          title={i18n("future_not_active")}
        >
          <Avatar sx={{ borderRadius: "20%", bgcolor: grey[200] }}>
            <ArrowForwardIosIcon sx={{ color: grey[900] }} />
          </Avatar>
        </ListItemAvatar>
      </ListItem>
    );
  },
  (prevProps, nextProps) => prevProps.data.eventId === nextProps.data.eventId
);

export default Items;

const magnitudeStyle = (magnitude) => {
  if (magnitude < 4) return { bgcolor: green["A100"], color: green[800] };

  if (magnitude < 5) return { bgcolor: yellow["A100"], color: yellow[800] };

  if (magnitude < 7) return { bgcolor: orange["A100"], color: orange[800] };

  return { bgcolor: red["A100"], color: red[800] };
};
