import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { i18n } from "@src/tools/helpers";

export interface ISettingOptions {
  name: string;
  value: string | number | boolean;
  selected?: boolean;
}

export interface ISetting {
  title: string;
  selected: ISettingOptions;
  options: ISettingOptions[];
  icon?: any;
  key?: keyof ISettings | false;
}

export interface ISettings {
  date: ISetting;
  magnitude: ISetting;
  notification: ISetting;
}

const initialState: ISettings = {
  date: {
    title: i18n("date"),
    selected: { name: i18n("all"), value: "all" },
    options: [
      { name: i18n("all"), value: "all" },
      { name: i18n("day", ["1"]), value: 1 },
      { name: i18n("week", ["1"]), value: 7 },
    ],
  },
  magnitude: {
    title: i18n("magnitude"),
    selected: { name: "2.5+", value: 2.5 },
    options: [
      { name: i18n("all"), value: "all" },
      { name: "1+", value: 1 },
      { name: "2.5+", value: 2.5 },
      { name: "4+", value: 4 },
    ],
  },
  notification: {
    title: i18n("notification"),
    selected: { name: i18n("all"), value: "all" },
    options: [
      { name: i18n("all"), value: "all" },
      { name: "2.5+", value: 2.5 },
      { name: "4+", value: 4 },
      { name: i18n("do_not_notification"), value: false },
    ],
  },
};
const slice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    settingsUpdate: (state, action: PayloadAction<ISettings>) => {
      return action.payload;
    },
  },
});

export const { settingsUpdate } = slice.actions;

export default slice.reducer;
