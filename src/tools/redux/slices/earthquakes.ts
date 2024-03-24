import { Dispatch, createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { API_URL, TIME_FORMAT } from "@src/tools/constants";
import moment from "moment";

export interface IEarthquake {
  eventId?: number;
  seen?: boolean;
  depth: number;
  eventDate: string;
  timezone: string;
  lat: string;
  lng: string;
  location: string;
  magnitude: number;
  provider: string;
  revize: string | null | false;
}

interface IEarthquakeInitialState {
  error?: string | null;
  isLoading?: boolean;
  data: IEarthquake[];
  unseen: number;
  lastFetch: Date | null;
}

const initialState: IEarthquakeInitialState = {
  error: null,
  isLoading: false,
  data: [],
  unseen: 0,
  lastFetch: null,
};

const slice = createSlice({
  name: "earthquakes",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEarthquakes: {
      reducer: (state, action: PayloadAction<IEarthquake[]>) => {
        state.unseen = 0;
        state.lastFetch = new Date();
        state.data = state.data
          .concat(action.payload)
          .filter((e: IEarthquake, index: number, self: IEarthquake[]) => {
            return index === self.findIndex((t) => t.eventId === e.eventId);
          });
      },
      prepare: (payload: IEarthquake[]) => {
        return {
          payload: payload.map((earthquake: IEarthquake) => {
            return {
              ...earthquake,
              eventDate: moment(earthquake.eventDate).format(TIME_FORMAT),
              seen: true,
            };
          }),
        };
      },
    },
    setEarthquake: {
      reducer: (state, action: PayloadAction<IEarthquake>) => {
        state.unseen = state.unseen + 1;
        state.data.push(action.payload);
        state.data = checkUnnecessary(state.data);
      },
      prepare: (payload: IEarthquake) => {
        return {
          payload: {
            ...payload,
            eventDate: moment(payload.eventDate).format(TIME_FORMAT),
            seen: false,
          },
        };
      },
    },
    setEarthquakeSeen: {
      reducer: (state, action: PayloadAction<IEarthquake>) => {
        state.data.push(action.payload);
        state.data = checkUnnecessary(state.data);
      },
      prepare: (payload: IEarthquake) => {
        return {
          payload: {
            ...payload,
            eventDate: moment(payload.eventDate).format(TIME_FORMAT),
            seen: true,
          },
        };
      },
    },
    resetUnseen: (state) => {
      state.unseen = 0;
      state.data = (state.data || []).map((earthquake: IEarthquake) => {
        earthquake.seen = true;
        return earthquake;
      });
    },
  },
});

export const {
  setLoading,
  setError,
  setEarthquakes,
  setEarthquake,
  setEarthquakeSeen,
  resetUnseen,
} = slice.actions;

export default slice.reducer;

export const getEarthquakes = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await fetch(`${API_URL}/earthquakes`);
    const earthquakes = await data.json();
    dispatch(setEarthquakes(earthquakes));
  } catch (error) {
    dispatch(setError(error.message));
  }
  dispatch(setLoading(false));
};

const checkUnnecessary = (data: IEarthquake[]): IEarthquake[] => {
  // If there are more than 1000, delete the first index and keep the last 1000
  return data.length > 1000 ? data.slice(data.length - 1000) : data;
};
