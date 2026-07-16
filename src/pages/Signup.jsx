import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  function handleSignup() {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const alreadyExist = users.find((user) => user.email === email);

    if (alreadyExist) {
      alert("Account already exists. Please Login.");
      navigate("/login");
      return;
    }
    const newUser = {
      name,
      email,
      password,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    setShowPopup(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  }

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch real user info from Google using the access token
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();

        const googleUser = {
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.picture,
          provider: "google",
        };

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const alreadyExist = users.find((u) => u.email === googleUser.email);
        if (!alreadyExist) {
          users.push(googleUser);
          localStorage.setItem("users", JSON.stringify(users));
        }

        localStorage.setItem("currentUser", JSON.stringify(googleUser));
        setShowPopup(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (err) {
        alert("Google login failed. Please try again.");
      }
    },
    onError: () => {
      alert("Google login failed. Please try again.");
    },
  });

  return (
    <div
      className="
min-h-screen
bg-black
text-white
overflow-hidden
relative
flex
items-center
justify-center
px-6
"
    >
      {showPopup && (
        <div
          className="
fixed
top-6
right-6
bg-green-500
px-6
py-4
rounded-2xl
font-semibold
shadow-2xl
z-50
animate-pulse
"
        >
          🎉 Account Created Successfully
        </div>
      )}

      {/* Glow */}

      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-20 blur-[150px]" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 opacity-20 blur-[150px]" />

      <div
        className="
relative
z-10
max-w-7xl
w-full
grid
lg:grid-cols-2
gap-16
items-center
"
      >
        {/* LEFT */}

        <div className="hidden lg:block">
          <div className="inline-flex px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-8">
            🎙️ PDFs To Podcast AI
          </div>

          <h1 className="text-6xl font-bold leading-tight">
            Join The Future Of
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              AI Learning
            </span>
          </h1>

          <p className="text-gray-400 mt-8 text-lg leading-8 max-w-xl">
            Create podcasts from PDFs instantly. Upload files generate scripts
            and transform knowledge into immersive AI audio experiences.
          </p>

          <div className="grid grid-cols-2 gap-5 mt-10">
            <div className="bg-white/5 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-blue-400 font-bold text-3xl">10K+</h2>

              <p className="text-gray-400 mt-2">Audio Created</p>
            </div>

            <div className="bg-white/5 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-purple-400 font-bold text-3xl">99%</h2>

              <p className="text-gray-400 mt-2">User Satisfaction</p>
            </div>
          </div>

          <div className="mt-10 space-y-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                ✓
              </div>

              <p>AI Script Generation</p>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex justify-center items-center">
                ✓
              </div>

              <p>Natural Voice Audio</p>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-600 flex justify-center items-center">
                ✓
              </div>

              <p>PDF Smart Processing</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
w-full
max-w-md
mx-auto
bg-white/5
backdrop-blur-xl
border
border-gray-800
rounded-[32px]
p-8
shadow-2xl
"
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex justify-center items-center text-4xl mb-5">
              🎙️
            </div>

            <h1 className="text-4xl font-bold">Create Account</h1>

            <p className="text-gray-400 mt-3">Start your AI journey today</p>
          </div>

          <form className="mt-8 space-y-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-black/30 border border-gray-700 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-black/30 border border-gray-700 rounded-xl px-5 py-4 outline-none focus:border-purple-500"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/30 border border-gray-700 rounded-xl px-5 py-4 outline-none focus:border-pink-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-4"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-bold hover:scale-[1.02] duration-300"
            >
              Create Account
            </button>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="
w-full
border
border-gray-700
bg-white/5
py-4
rounded-xl
font-semibold
flex
justify-center
items-center
gap-3
hover:bg-white/10
duration-300
"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.3 30.2 0 24 0 14.7 0 6.7 5.5 2.8 13.5l7.8 6C12.4 13.6 17.8 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.8 37.5 46.5 31.4 46.5 24.5z"/>
                <path fill="#FBBC05" d="M10.6 28.5c-.5-1.5-.8-3-.8-4.5s.3-3 .8-4.5l-7.8-6C1 16.3 0 20 0 24s1 7.7 2.8 10.5l7.8-6z"/>
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.3-7.7 2.3-6.2 0-11.5-4.2-13.4-9.8l-7.8 6C6.7 42.5 14.7 48 24 48z"/>
              </svg>
              Continue With Google
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Already have account?
            <Link to="/login" className="text-blue-400 ml-2">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;