import {
  List,
  Box,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Modal,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useTypedDispatch, useTypedSelector } from "@src/tools/redux";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { blue, grey } from "@mui/material/colors";
import { useState } from "react";
import { ISettings, setSettings } from "@src/tools/redux/slices/settings";
import { i18n } from "@src/tools/helpers";

const OptionList = [
  {
    name: "date",
    icon: <AccessTimeIcon />,
  },
  {
    name: "size",
    icon: <TimelineIcon />,
  },
  {
    name: "notifications",
    icon: <NotificationsIcon />,
  },
];

export default function () {
  const dispatch = useTypedDispatch();
  const settings = useTypedSelector((state) => state.settings);
  const [open, setOpen] = useState<keyof ISettings | false>(false);

  const handleOpen = (value: keyof ISettings) => setOpen(value);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <List className="list">
        {OptionList.map((opt, index) => (
          <ListItem key={index} className="list-item">
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: blue[300], borderRadius: "20%" }}>
                {opt.icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={settings[opt.name].name}
              secondary={i18n(settings[opt.name].value)}
            />

            <ListItemAvatar
              sx={{ borderRadius: "20%", cursor: "pointer" }}
              onClick={() => handleOpen(opt.name as keyof ISettings)}
            >
              <Avatar sx={{ borderRadius: "20%", backgroundColor: grey[200] }}>
                <SettingsIcon sx={{ color: grey[900] }} />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        ))}
      </List>
      <Modal
        open={!!open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
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
              <RadioGroup value={settings[open].value}>
                {settings[open].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={i18n(option)}
                    onClick={() => {
                      dispatch(
                        setSettings({
                          ...settings,
                          [open]: {
                            ...settings[open],
                            value: option,
                          },
                        })
                      );
                    }}
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
