import { getAuth, signOut } from "firebase/auth";
import { setUser } from "../../store/userSlice";

export const logoutUser = (dispatch, navigate, resetUserAction) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      dispatch(resetUserAction); // Clear Redux state
      sessionStorage.clear(); // Optional: Clear session storage
      localStorage.removeItem("user"); // Optional: Clear local storage
      navigate("/SignIn"); // Redirect to sign-in page
    })
    .catch((error) => console.error("Logout failed:", error.message));
};

// Default export for the Logout component
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser(dispatch, navigate, setUser({ avatar: null, username: null }));
  }, [dispatch, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
