import AuthSlice from "../Slices/authSlice.tsx";
import { configureStore } from "@reduxjs/toolkit";

export const Store = configureStore({
  reducer: {
    AuthSlice,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
