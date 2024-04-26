import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IAlarms {
  lastWork?: Date;
  apiCallTime?: number;
}

const initialState: IAlarms = {
  lastWork: new Date(),
  apiCallTime: 1000 * 60, // 1 minutes
};

const slice = createSlice({
  name: "alarms",
  initialState: initialState,
  reducers: {
    setLastWork: (state, action?: PayloadAction<Date>) => {
      state.lastWork = action?.payload || new Date();
    },
  },
});

export const { setLastWork } = slice.actions;

export default slice.reducer;
