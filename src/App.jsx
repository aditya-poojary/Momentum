import { useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'


export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Enable persistence
    auth.setPersistence("local").then(() => {
      // Listen to auth state changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          const avatar = user.photoURL || "default-avatar.png";
          const username = user.displayName || user.email.split("@")[0];
          dispatch(setUser({ avatar, username }));
        } else {
          // User is signed out
          dispatch(setUser(null));
        }
      });

      // Cleanup the subscription on component unmount
      return () => unsubscribe();
    }).catch((error) => {
      console.error("Failed to set persistence:", error.message);
    });
  }, [dispatch]);

  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}