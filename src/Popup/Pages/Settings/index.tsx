import { useCallback, useMemo, useState } from "react";

import {
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Modal,
  FormControl,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import SettingsIcon from "@mui/icons-material/Settings";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TimelineIcon from "@mui/icons-material/Timeline";
import { grey } from "@mui/material/colors";

import {
  ISetting,
  ISettingOptions,
  ISettings,
  settingsUpdate,
} from "@src/tools/redux/slices/settings";
import { i18n } from "@src/tools/helpers";
import { useTypedDispatch, useTypedSelector } from "@src/tools/redux";

const IconList = {
  date: AccessTimeIcon,
  magnitude: TimelineIcon,
  notification: NotificationsIcon,
};

export default function () {
  const dispatch = useTypedDispatch();
  const settings = useTypedSelector((state) => state.settings);

  const [open, setOpen] = useState<keyof ISettings | false>(false);
  const handleOpen = (value: keyof ISettings | false) => setOpen(value);
  const handleClose = () => setOpen(false);

  const handleUpdate = useCallback(
    (key: keyof ISettings, data: ISettingOptions) => {
      dispatch(
        settingsUpdate({
          ...settings,
          [key]: {
            ...settings[key],
            selected: data,
          },
        })
      );
    },
    [dispatch, settings]
  );

  const Settings = useMemo(() => {
    return Object.keys(settings).reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          ...settings[key],
          icon: IconList[key],
          key: key,
        },
      };
    }, {});
  }, [settings]);

  if (!settings) {
    return null;
  }

  return (
    <Box className="container options">
      <CssBaseline />
      <List className="list">
        {Object.values(Settings).map((Setting: ISetting, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[300], borderRadius: "20%" }}>
                <Setting.icon />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={Setting.title}
              secondary={Setting.selected.name || "-"}
            />

            <ListItemAvatar
              sx={{ textAlign: "-webkit-right", cursor: "pointer" }}
              onClick={() => handleOpen(Setting.key)}
            >
              <Avatar sx={{ borderRadius: "20%", bgcolor: grey[200] }}>
                <SettingsIcon sx={{ color: grey[900] }} />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        ))}
      </List>
      <Modal open={!!open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: "3px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {open && (
            <FormControl>
              <RadioGroup value={settings[open].selected.value}>
                {settings[open].options.map((data, index) => (
                  <FormControlLabel
                    key={index}
                    value={data.value}
                    control={<Radio />}
                    label={data.name || "-"}
                    onClick={() => handleUpdate(open, data)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
