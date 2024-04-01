import { useEffect, useMemo } from "react";
import { Box, List, Typography } from "@mui/material";
import {
  IEarthquake,
  getEarthquakes,
} from "@src/tools/redux/slices/earthquakes";
import { useTypedSelector, useTypedDispatch } from "@src/tools/redux";
import { resetUnseen } from "@src/tools/redux/slices/earthquakes";
import moment from "moment";
import Item from "./Item";
import { i18n } from "@src/tools/helpers";

export default (function () {
  const dispatch = useTypedDispatch();
  const earthquakes = useTypedSelector((state) => state.earthquakes);
  const { magnitude, date } = useTypedSelector((state) => state.settings);

  useEffect(() => {
    window.addEventListener("visibilitychange", function (event) {
      dispatch(resetUnseen());
      if (!earthquakes.data.length) {
        dispatch(getEarthquakes());
      }
    });
  }, []);

  const shortList = useMemo((): IEarthquake[] => {
    return earthquakes.data
      .reverse()
      .sort((a, b) => b.eventId - a.eventId)
      .filter((data: IEarthquake) => {
        if (date.selected.value === "all") {
          return data;
        }
        var now = moment();
        var eventDate = moment(data.eventDate, "DD.MM.YYYY HH:mm:ss");
        var howManyDays = now.diff(eventDate, "days");

        if (howManyDays < Number(date.selected.value)) {
          return data;
        }
      })
      .filter((data: IEarthquake) => {
        if (magnitude.selected.value === "all") {
          return data;
        }
        if (Number(magnitude.selected.value) <= Number(data.magnitude)) {
          return data;
        }
      })
      .filter((data: IEarthquake, index) => {
        if (index < 50) {
          return data;
        }
      });
  }, [earthquakes.data]);

  if (earthquakes.data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6" fontWeight={"600"} color={"grey.500"}>
          {i18n("list_is_empty")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="container">
      <List className="list">
        {shortList.map((data: IEarthquake) => (
          <Item data={data} key={data.eventId} />
        ))}
      </List>
    </Box>
  );
});
