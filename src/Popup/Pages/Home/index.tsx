import { Box, List } from "@mui/material";
import Item from "./Item";
import { useTypedDispatch, useTypedSelector } from "@src/tools/redux";
import { useEffect, useMemo } from "react";
import { resetUnseen } from "@src/tools/redux/slices/earthquakes";

export default function () {
  const dispatch = useTypedDispatch();
  const earthquakes = useTypedSelector((state) => state.earthquakes);

  useEffect(() => {
    window.addEventListener("visibilitychange", () => {
      dispatch(resetUnseen());
    });
  }, []);

  const sortList = useMemo(() => {
    return earthquakes.data
      .sort((a, b) => {
        return (
          new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
      })
      .filter((item, index) => {
        return index < 100;
      });
  }, [earthquakes.data]);

  return (
    <Box>
      <List className="list">
        {sortList.map((item, index) => (
          <Item key={index} data={item} />
        ))}
      </List>
    </Box>
  );
}
