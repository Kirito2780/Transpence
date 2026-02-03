import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: localStorage.getItem("currency") || "$",
};

export const currencySlice = createSlice({
  name: "currency",
  initialState: initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
