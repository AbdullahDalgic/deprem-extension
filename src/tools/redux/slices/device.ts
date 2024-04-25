import { Dispatch, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useGetState } from "..";
import { API_URL } from "@src/tools/constants";

interface IDeviceProps {
  fcm_token: string;
  app_version?: string;
  device_model?: string;
  device_os?: string;
  device_os_version?: string;
  ip?: string;
  country?: string;
  city?: string;
  timezone?: string;
}

export interface IDevice {
  fcm_token: string;
  fcm_token_sent: boolean;
  fcm_id?: number;
}

const initialState: IDevice = {
  fcm_token: "",
  fcm_token_sent: false,
};

const slice = createSlice({
  name: "device",
  initialState: initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.fcm_token = action.payload;
      state.fcm_token_sent = false;
    },
    setTokenSent: (state, action?: PayloadAction<boolean>) => {
      state.fcm_token_sent = true;
    },
  },
});

export const { setToken, setTokenSent } = slice.actions;

export default slice.reducer;

export const sendToken =
  (fcm_token: string) => async (dispatch: Dispatch, getState: useGetState) => {
    dispatch(setToken(fcm_token));

    const manifest = chrome.runtime.getManifest();
    const device: IDeviceProps = {
      fcm_token,
      app_version: manifest.version,
      device_model: navigator.userAgent,
      device_os: "chrome",
      device_os_version: navigator.appVersion,
    };

    try {
      const info = await (await fetch("https://ipapi.co/json/")).json();
      device.ip = info.ip;
      device.country = info.country;
      device.city = info.city;
      device.timezone = info.timezone;
    } catch (error) {}

    const result = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(device),
    });
    if (!result.ok) {
      return;
    }

    dispatch(setTokenSent());
  };
