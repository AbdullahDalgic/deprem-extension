import {
  ReduxedSetupOptions,
  StoreCreatorContainer,
  setupReduxed,
} from "reduxed-chrome-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { REDUX_STATE_KEY } from "@src/tools/constants";

import earthquakes from "@src/tools/redux/slices/earthquakes";
import settings from "@src/tools/redux/slices/settings";

const rootReducer = combineReducers({
  // reducers
  earthquakes,
  settings,
});
const store = configureStore({ reducer: rootReducer });

const storeCreatorContainer: StoreCreatorContainer = (preloadedState?) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });

const options: ReduxedSetupOptions = {
  storageKey: REDUX_STATE_KEY,
  storageArea: "local",
};

const reduxedStore = setupReduxed(storeCreatorContainer, options);

export default reduxedStore;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useTypedDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
