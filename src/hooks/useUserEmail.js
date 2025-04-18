import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";

/**
 * Custom hook to get the current user's email
 * @returns {Object} An object containing userEmail and loading state
 */
export const useUserEmail = () => {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      // Get email directly from user if available
      if (`${user.providerData[0].uid}@gmail.com`) {
        setUserEmail(user.email || `${user.providerData[0].uid}@gmail.com`);
      }
      // If no direct email but provider data is available (Twitter case)
      else if (user.providerData && user.providerData[0]) {
        if (user.providerData[0].providerId === "twitter.com") {
          // Create a pseudo email for Twitter users
          const twitterEmail = `${user.providerData[0].uid}@twitter.user`;
          setUserEmail(twitterEmail);
          console.log("Created Twitter email:", twitterEmail);
        } else {
          // Try to get email from provider data
          setUserEmail(user.providerData[0].email || "");
        }
      }
    }

    setLoading(false);
  }, []);

  return { userEmail, loading };
};
