// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import animationReducer from "./animationSlice";
import userReducer from "./userSlice"; // import the new slice
import projectsReducer from "./projectsSlice"; // import the new slice

const store = configureStore({
  reducer: {
    animation: animationReducer,
    user: userReducer,
    projects: projectsReducer, // add the user reducer
  },
});

export default store;
