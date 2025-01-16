import { createSlice } from "@reduxjs/toolkit";

const animationSlice = createSlice({
  name: "animation",
  initialState: {
    fromHeroPage: false,
  },
  reducers: {
    setFromHeroPage: (state, action) => {
      state.fromHeroPage = action.payload;
    },
  },
});

export const { setFromHeroPage } = animationSlice.actions;
export default animationSlice.reducer;
