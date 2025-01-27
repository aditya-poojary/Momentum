import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbUkeTfFeyn4upB1cc8x81Z5ShQUdJ6M0",
  authDomain: "momentum-b275f.firebaseapp.com",
  projectId: "momentum-b275f",
  storageBucket: "momentum-b275f.appspot.com",
  messagingSenderId: "768894045961",
  appId: "1:768894045961:web:194eb912c29f1ec1e7cdd8",
  databaseURL: "https://momentum-b275f-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);
