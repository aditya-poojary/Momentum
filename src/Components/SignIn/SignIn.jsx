import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { app } from "../../Backend";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFromHeroPage } from "../../store/animationSlice";
import { setUser } from "../../store/userSlice";
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");
const twitterProvider = new TwitterAuthProvider();
const auth = getAuth(app);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false); // Toggle for signup animation
  const [initialAnimation, setInitialAnimation] = useState(true); // Toggle for initial form animation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fromHeroPage = useSelector((state) => state.animation.fromHeroPage); // Get from Redux

  useEffect(() => {
    if (fromHeroPage) {
      setTimeout(() => dispatch(setFromHeroPage(false)), 100);
    }

    // Trigger the initial form animation
    const timer = setTimeout(() => {
      setInitialAnimation(false);
    }, 100); // Delay to allow the initial render before starting the animation

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [fromHeroPage, dispatch]);

  const loginUser = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        const username = user.email.split("@")[0]; // Extract username from email
        dispatch(
          setUser({
            username,
            avatar: "default-avatar.png", // Set the default avatar
          })
        ); // Store username in Redux
        dispatch(setFromHeroPage(false));
        navigate("/HeroPage");
      })
      .catch((error) => console.error("Login failed:", error.message));
  };

  const goToSignUp = () => {
    setShowSignUp(true); // Start transition animation
    setTimeout(() => {
      navigate("/signup");
    }, 500); // Delay navigation until animation finishes
  };

  const googleLoginHandler = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const avatar = user.photoURL; 
        const username = user.displayName || user.email.split("@")[0];
        dispatch(setUser({ avatar, username }));
        console.log("Google sign-in successful, redirecting to HeroPage...");
        console.log("photoURL:", user.photoURL);
        navigate("/HeroPage");
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          console.error(
            "Account exists with a different credential for Google"
          );
        } else {
          console.error("Google sign-in failed:", error.message);
        }
      });
  };

  const handleSignIn = (provider, providerName) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const avatar = user.photoURL || "/default-avatar.png"; // Fallback to default avatar
        const username = user.displayName || user.email.split("@")[0];
        dispatch(setUser({ avatar, username }));
        console.log(
          `${providerName} sign-in successful, redirecting to HeroPage...`
        );
        navigate("/HeroPage");
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          console.error(
            `Account exists with a different credential for ${providerName}`
          );
        } else {
          console.error(`${providerName} sign-in failed:`, error.message);
        }
      });
  };

  const signinwithMicrosoft = () =>
    handleSignIn(microsoftProvider, "Microsoft");
  const signinwithTwitter = () => handleSignIn(twitterProvider, "Twitter");

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* Image on the Left with conditional entry/exit animation */}
      <div
        className={`hidden lg:flex w-1/2 items-center justify-center transform transition-all duration-1000 overflow-hidden ${
          showSignUp
            ? "translate-x-full opacity-0" // Exit animation with fade-out on signup redirect
            : fromHeroPage
            ? "-translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <img
          src="LoginImage.png"
          alt="Login Illustration"
          className="w-full max-w-xl h-auto rounded-lg shadow-2xl border border-gray-300"
          style={{
            maxHeight: "95vh",
            boxShadow: "0px 8px 25px rgba(120, 80, 200, 0.75)",
          }}
        />
      </div>
      <div
        className={`w-full lg:w-1/2 flex justify-center items-center p-8 transform transition-transform duration-1000 ${
          showSignUp
            ? "-translate-y-full"
            : initialAnimation
            ? "translate-y-full"
            : "translate-y-0"
        }`}
      >
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#152d80] mb-4">
            Sign In to Your Account
          </h2>
          <form className="space-y-4" onSubmit={loginUser}>
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
              className="w-full bg-[#152d46] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#152d90] transition duration-300"
            >
              Sign In
            </button>
          </form>
          <button
            onClick={goToSignUp}
            className="mt-4 text-sm text-[#152d80] underline"
          >
            Don’t have an account? Sign up
          </button>

          {/* Social Media Icons Below Sign Up Button */}
          <div className="mt-6 text-center">
            <p className="text-gray-700 mb-2">Or sign in with</p>
            <div className="flex justify-center space-x-4">
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
                onClick={googleLoginHandler}
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
                onClick={signinwithMicrosoft}
              >
                {" "}
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
                onClick={signinwithTwitter}
              >
                <svg className="w-6 h-6 text-gray-500" viewBox="0 0 48 48">
                  <path
                    fill="#000000"
                    d="M36.6 3.6h5.7l-12.4 14.2 14.6 19.6h-11.5l-9-11.7-10.2 11.7h-5.7l13.3-15.2L7.4 3.6h11.8l8.1 10.7zm-2 30.2h3.2L17.3 7.3H14l20.6 26.5z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
