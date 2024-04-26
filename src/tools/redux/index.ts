import {
  ReduxedSetupOptions,
  StoreCreatorContainer,
  setupReduxed,
} from "reduxed-chrome-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import earthquakes from "./slices/earthquakes";
import settings from "./slices/settings";
import device from "./slices/device";
import alarms from "./slices/alarms";

const rootReducer = combineReducers({
  earthquakes,
  settings,
  device,
  alarms,
});

const store = configureStore({
  reducer: rootReducer,
});

const storeCreatorContainer: StoreCreatorContainer = (preloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });

const options: ReduxedSetupOptions = {
  storageKey: "redux",
  storageArea: "local",
};

const reduxStorage = setupReduxed(storeCreatorContainer, options);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useTypedDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export type useGetState = () => RootState;

export default reduxStorage;
