import AuthSlice from "../Slices/authSlice.tsx";
import DateSlice from "../Slices/dateSlice.tsx";
import CurrencySlice from "../Slices/currencySlice.tsx";
import { configureStore } from "@reduxjs/toolkit";

export const Store = configureStore({
  reducer: {
    AuthSlice,
    DateSlice,
    CurrencySlice,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
