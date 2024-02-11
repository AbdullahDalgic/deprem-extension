import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
import { API_URL, TIME_FORMAT } from "@src/tools/constants";
import moment from "moment";

export interface IEarthquake {
  id?: string;
  seen: boolean;
  depth: number;
  magnitude: number;
  lat: string;
  lng: string;
  location: string;
  country?: string;
  province?: string;
  district?: string;
  neighborhood?: string;
  eventDate: string;
  timezone: string;
  eventID?: string;
  provider: string;
  revize?: string | number | false;
}

export interface IEarthquakeState {
  data: IEarthquake[];
  unseen: number;
}

const initialState: IEarthquakeState = {
  data: [],
  unseen: 0,
};

const slice = createSlice({
  name: "earthquakes",
  initialState: initialState,
  reducers: {
    setEarthquakes: {
      reducer: (state, action: PayloadAction<IEarthquake[]>) => {
        state.data = action.payload;
      },
      prepare: (payload: IEarthquake[]) => {
        return {
          payload: payload.map((item) => ({
            ...item,
            eventDate: moment(item.eventDate).format(TIME_FORMAT),
            seen: true,
            id: nanoid(),
          })),
        };
      },
    },
    setEarthquake: {
      reducer: (state, action: PayloadAction<IEarthquake>) => {
        state.unseen += 1;
        state.data.push(action.payload);
      },
      prepare: (payload: IEarthquake) => {
        return {
          payload: {
            ...payload,
            eventDate: moment(payload.eventDate).format(TIME_FORMAT),
            seen: false,
            id: nanoid(),
          },
        };
      },
    },
    setEarthquakeSeen: {
      reducer: (state, action: PayloadAction<IEarthquake>) => {
        state.data.push(action.payload);
      },
      prepare: (payload: IEarthquake) => {
        return {
          payload: {
            ...payload,
            eventDate: moment(payload.eventDate).format(TIME_FORMAT),
            seen: true,
            id: nanoid(),
          },
        };
      },
    },
    resetUnseen: (state) => {
      state.unseen = 0;
    },
  },
});

export const { setEarthquakes, setEarthquake, setEarthquakeSeen, resetUnseen } =
  slice.actions;
export default slice.reducer;

export const getEarthquakes = () => async (dispatch) => {
  try {
    const data = await fetch(`${API_URL}/earthquakes`);
    const earthquakes = await data.json();
    dispatch(setEarthquakes(earthquakes));
  } catch (error) {}
};
