import React from "react";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"; // Import BrowserRouter
import { Provider, useDispatch } from "react-redux";
import store from "./store/store.js";
import { app } from "./firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createOrFetchUserDocument } from "./Firestore/UserDocument.js"; // Adjust the path

import { setUser } from "./store/userSlice";


import Layout from "./Layout.jsx";
import LandingPage from "./Components/LandingPage/LandingPage.jsx";
import CreateProject from "./Components/CreateProject/CreateProject.jsx";
import Features from "./Components/Header/Navbar/Features/Features.jsx";
import AboutUs from "./Components/Header/Navbar/AboutUs/AboutUs.jsx";
import ContactUs from "./Components/Header/Navbar/ContactUs/ContactUs.jsx";
import SignUp from "./Components/SignUp/Signup.jsx";
import SignIn from "./Components/SignIn/SignIn.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import EditProfile from "./Components/EditProfile/EditProfile.jsx";
import Logout from "./Components/Logout/Logout.jsx"; // Import the React component, not the function
import MyProjects from "./Components/MyProjects/MyProjects.jsx";
import TrashBin from "./Components/TrashBin/TrashBin.jsx";
import MyProjectsnew from "./Pages/MyProjectsnew.jsx";
import SuccessProject from "./Components/SuccessProject/SuccessProject.jsx";
import TOS from "./Components/TOS & Privacy/TOSPrivacy.jsx";

const auth = getAuth(app);

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);  // Track initialization state

  // Sync Auth State Handling
  const checkAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const avatar = user.photoURL || "default-avatar.png";
        const username = user.displayName || user.email.split("@")[0];
        try {
          // Call Firestore logic to create or fetch the user's document
           createOrFetchUserDocument(user.email);
        } catch (error) {
          console.error("Error creating or fetching user document:", error);
        }
        dispatch(setUser({ avatar, username }));
      } else {
        dispatch(setUser(null));
      }

      setInitializing(false); // Mark initialization as done
    });
  };

  // Initialize auth state as soon as possible
  if (initializing) {
    checkAuthState(); // Call directly
  }

  // Only render children after auth state is initialized
  return !initializing ? children : null;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/Features" element={<Features />} />
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/ContactUs" element={<ContactUs />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="" element={<LandingPage />} />
      <Route path="/CreateProject" element={<CreateProject />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path = "/MyProjects" element={<MyProjects/>}/>
      <Route path = "/Trashbin" element={<TrashBin/>}/>
      <Route path="/Logout" element={<Logout />} />
      <Route path="/successful-projects" element={<SuccessProject/>} />
      <Route path="/tos" element={<TOS/>} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>
);
