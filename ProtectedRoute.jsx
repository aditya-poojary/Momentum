import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (!user || !user.username) {
    // If the user is not authenticated, redirect to the SignIn page
    return <Navigate to="/SignIn" replace />;
  }

  // If authenticated, render the children (protected component)
  return children;
};

export default ProtectedRoute;
