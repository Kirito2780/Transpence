import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstDay: null,
};

export const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setFirstDay(state, action) {
      state.firstDay = action.payload;
    },
  },
});

export const { setFirstDay } = dateSlice.actions;
export default dateSlice.reducer;
