import React from "react";

import SettingsIcon from "@mui/icons-material/Settings";
import WaterIcon from "@mui/icons-material/Water";
import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import moment from "moment";
import { getSystemLanguage, i18n } from "@src/tools/helpers";

import Home from "./Pages/Home";
import Settings from "./Pages/Settings";

const Pages = {
  Home: <Home />,
  Settings: <Settings />,
};

const lang = getSystemLanguage();
moment.locale(lang);

export default function Navigation() {
  const [value, setValue] = React.useState(Object.keys(Pages)[0]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ overflow: "auto", paddingBottom: 7 }}>{Pages[value]}</Box>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          sx={{ width: "100%" }}
          value={value}
          onChange={handleChange}
        >
          <BottomNavigationAction
            label={i18n("earthquakes")}
            value="Home"
            icon={<WaterIcon />}
          />
          <BottomNavigationAction
            label={i18n("settings")}
            value="Settings"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
