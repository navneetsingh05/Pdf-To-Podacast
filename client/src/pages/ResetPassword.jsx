import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { token } = useParams();

  async function handleResetPassword(e) {
    if (e) e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Please enter all fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/resetpassword/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to reset password. Token might be invalid or expired.");
      } else {
        setMessage(data.message || "Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-6">
      {/* Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-20 blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 opacity-20 blur-[150px]" />

      <div className="relative z-10 w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-gray-800 rounded-[32px] p-8 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex justify-center items-center text-4xl">
            🔑
          </div>

          <h1 className="text-4xl font-bold">Reset Password</h1>

          <p className="text-gray-400 mt-3">Enter your new password</p>
        </div>

        <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-black/30 border border-gray-700 rounded-xl px-5 py-4 outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-4"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full bg-black/30 border border-gray-700 rounded-xl px-5 py-4 outline-none focus:border-purple-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {message && <p className="text-green-400 text-sm text-center">{message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-bold hover:scale-[1.02] duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
