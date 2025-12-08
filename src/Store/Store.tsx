import AuthSlice from "../Slices/authSlice.tsx";
import DateSlice from "../Slices/dateSlice.tsx";
import { configureStore } from "@reduxjs/toolkit";

export const Store = configureStore({
  reducer: {
    AuthSlice,
    DateSlice,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
