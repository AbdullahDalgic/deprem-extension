import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { green, orange, red, yellow } from "@mui/material/colors";
import { IEarthquake } from "@src/tools/redux/slices/earthquakes";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CellTowerIcon from "@mui/icons-material/CellTower";

export default function ({ data }: { data: IEarthquake }) {
  return (
    <ListItem className={`list-item ${!data.seen ? "unseen" : ""}`}>
      <ListItemAvatar>
        <Avatar
          sx={{
            ...magnitudeStyle(data.magnitude),
            fontWeight: "bold",
            borderRadius: "20%",
          }}
        >
          {data.magnitude}
        </Avatar>
      </ListItemAvatar>
      <Box>
        <Typography
          variant="subtitle1"
          gutterBottom
          fontSize={13}
          fontWeight={600}
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
            <AccessTimeIcon style={{ fontSize: 15, marginRight: "2px" }} />
            <Typography variant="caption">
              Türkiye Saati : {data.eventDate}
            </Typography>
          </Box>

          <Box justifyContent={"start"} display={"flex"}>
            <CellTowerIcon style={{ fontSize: 15, marginRight: "2px" }} />
            <Typography variant="caption">{data.provider}</Typography>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
}

const magnitudeStyle = (magnitude: number) => {
  if (magnitude < 4) {
    return {
      backgroundColor: green["A100"],
      color: green[800],
    };
  } else if (magnitude < 5) {
    return {
      backgroundColor: yellow["A100"],
      color: yellow[800],
    };
  } else if (magnitude < 6) {
    return {
      backgroundColor: orange["A100"],
      color: orange[800],
    };
  } else {
    return {
      backgroundColor: red["A100"],
      color: red[800],
    };
  }
};
