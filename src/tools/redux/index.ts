import {
  ReduxedSetupOptions,
  StoreCreatorContainer,
  setupReduxed,
} from "reduxed-chrome-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import earthquakes from "./slices/earthquakes";
import settings from "./slices/settings";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

const rootReducer = combineReducers({
  earthquakes,
  settings,
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

export default reduxStorage;
