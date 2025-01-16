import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    avatar: "default-avatar.png", // Default avatar
    username: "Guest", // Default username
  },
  reducers: {
    setUser(state, action) {
      state.avatar = action.payload?.avatar || "default-avatar.png";
      state.username = action.payload?.username || "Guest";
    },
    clearUser(state) {
      state.avatar = "default-avatar.png";
      state.username = "Guest";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
