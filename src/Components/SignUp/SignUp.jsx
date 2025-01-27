import { React, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider, // Import OAuthProvider for Microsoft login
  TwitterAuthProvider, // Import TwitterAuthProvider for Twitter login
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com"); // Define Microsoft provider
const twitterProvider = new TwitterAuthProvider(); // Define Twitter provider
const auth = getAuth(app);

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [initialAnimation, setInitialAnimation] = useState(true);
  const [fadeInImage, setFadeInImage] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialAnimation(false);
      setFadeInImage(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  const signupUser = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => navigate("/HeroPage"))
      .catch((error) => console.error("Signup failed:", error.message));
  };

  const goToLogin = () => {
    setShowLogin(true);
    setTimeout(() => {
      navigate("/SignIn");
    }, 800);
  };

  const dispatch = useDispatch();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const avatar = user.photoURL || "/default-avatar.png";
        const username = user.displayName || user.email.split("@")[0];
        dispatch(setUser({ avatar, username }));
        navigate("/HeroPage");
      })
      .catch(handleSignInError);
  };

  const handleMicrosoftSignIn = () => {
    signInWithPopup(auth, microsoftProvider)
      .then((result) => {
        const user = result.user;
        const avatar = user.photoURL || "/default-avatar.png";
        const username = user.displayName || user.email.split("@")[0];
        dispatch(setUser({ avatar, username }));
        navigate("/HeroPage");
      })
      .catch(handleSignInError);
  };

  const handleTwitterSignIn = () => {
    signInWithPopup(auth, twitterProvider)
      .then((result) => {
        const user = result.user;
        const avatar = user.photoURL || "/default-avatar.png"; // Fallback image if Twitter doesn't provide one
        const username = user.displayName || user.email.split("@")[0]; // Use part of email as fallback for username
        dispatch(setUser({ avatar, username }));
        console.log("Twitter sign-in successful, redirecting to HeroPage...");
        navigate("/HeroPage"); // Navigate after successful authentication
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          setPopupMessage(
            "An account with this email already exists. Please sign in instead."
          );
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/SignIn");
          }, 3000);
        } else {
          console.error("Twitter sign-in failed:", error.message);
        }
      });
  };

  const handleSignInError = (error) => {
    if (error.code === "auth/account-exists-with-different-credential") {
      setPopupMessage(
        "An account with this email already exists. Please sign in instead."
      );
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/SignIn");
      }, 3000);
    } else {
      console.error("Sign in failed:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden relative">
      <div
        className={`absolute right-0 top-0 w-1/2 h-full transform transition-all duration-1000 ease-in-out ${
          showLogin
            ? "-translate-x-full opacity-0" // Slide out to the left with fade-out on login
            : "translate-x-0 opacity-100" // Fade in initially
        }`}
      >
        <img
          src="SignUpImage.png"
          alt="Signup Illustration"
          className="w-full max-w-xl h-auto rounded-lg shadow-2xl border border-gray-300 mt-5"
          style={{
            maxHeight: "95vh", // Keeps height unchanged
            boxShadow: "0px 8px 25px rgba(120, 80, 200, 0.75)", // Matches the theme color
          }}
        />
      </div>
      <div
        className={`flex flex-col w-full lg:w-1/2 justify-center items-center p-8 transform transition-all duration-1000 ease-in-out ${
          showLogin
            ? "translate-y-full opacity-0"
            : initialAnimation
            ? "translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <h2 className="text-3xl font-bold text-[#152d80] mb-4">
          Create Your Account
        </h2>
        <form className="w-full max-w-md space-y-4" onSubmit={signupUser}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#152d46]"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#152d46]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#152d46] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#152d90] transition duration-300 "
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={goToLogin}
          className="mt-4 text-sm text-[#152d80] underline"
        >
          Already have an account? Log in
        </button>
        <div className="mt-6 text-center">
          <p className="text-gray-700 mb-2">Or sign in with</p>
          <div className="flex justify-center space-x-4">
            <button
              className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                    s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                    s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                    C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                    c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                    c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
              onClick={handleMicrosoftSignIn}
            >
              <svg className="w-6 h-6 text-gray-500" viewBox="0 0 48 48">
                <g>
                  <path fill="#f25022" d="M0 0h22v22H0z" />
                  <path fill="#00a4ef" d="M0 26h22v22H0z" />
                  <path fill="#7fba00" d="M26 0h22v22H26z" />
                  <path fill="#ffb900" d="M26 26h22v22H26z" />
                </g>
              </svg>
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
              onClick={handleTwitterSignIn}
            >
              <svg className="w-6 h-6 text-gray-500" viewBox="0 0 48 48">
                <path
                  fill="#000000"
                  d="M36.6 3.6h5.7l-12.4 14.2 14.6 19.6h-11.5l-9-11.7-10.2 11.7h-5.7l13.3-15.2L7.4 3.6h11.8l8.1 10.7zm-2 30.2h3.2L17.3 7.3H14l20.6 26.5z"
                />
              </svg>
            </button>
          </div>
          {currentUser && (
            <div className="flex items-center mt-4">
              <img
                src={currentUser.photoURL}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-2"
              />
              <p>{currentUser.displayName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
