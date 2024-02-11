import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import WavesIcon from "@mui/icons-material/Waves";
import SettingsIcon from "@mui/icons-material/Settings";
import { useMemo, useState } from "react";
import Home from "./Pages/Home";
import Settings from "./Pages/Settings";

const Pages = [
  {
    value: "home",
    component: <Home />,
  },
  {
    value: "settings",
    component: <Settings />,
  },
];

export default function Navigation() {
  const [value, setValue] = useState(Pages[0].value);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box className="container">
      {Pages.find((page) => page.value === value)?.component}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <BottomNavigation
          sx={{
            width: "100%",
          }}
          value={value}
          onChange={handleChange}
        >
          <BottomNavigationAction
            label="Depremler"
            value="home"
            icon={<WavesIcon />}
          />

          <BottomNavigationAction
            label="Ayarlar"
            value="settings"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
