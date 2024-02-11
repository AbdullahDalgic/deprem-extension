import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const dateOptions = ["all", "1", "7"];
const sizeOptions = ["all", "1+", "2.5+", "4+"];
const notifications = ["all", "2.5+", "4+", "do_not_notify"];

export interface ISettings {
  date: {
    options: typeof dateOptions;
    value: (typeof dateOptions)[number];
    name: string;
  };
  size: {
    options: typeof sizeOptions;
    value: (typeof sizeOptions)[number];
    name: string;
  };
  notifications: {
    options: typeof notifications;
    value: (typeof notifications)[number];
    name: string;
  };
}

const initialState: ISettings = {
  date: {
    options: dateOptions,
    value: "all",
    name: "Zaman",
  },
  size: {
    options: sizeOptions,
    value: "all",
    name: "Büyüklük",
  },
  notifications: {
    options: notifications,
    value: "all",
    name: "Bildirimler",
  },
};

const slice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<ISettings>) => {
      return action.payload;
    },
  },
});

export const { setSettings } = slice.actions;
export default slice.reducer;
