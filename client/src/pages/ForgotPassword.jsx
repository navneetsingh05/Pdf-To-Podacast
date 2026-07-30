import { Link } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleForgotPassword(e) {
    if (e) e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to send reset link");
      } else {
        setMessage(data.message || "Reset link sent successfully! Check your email (or backend console if running locally).");
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
            🔒
          </div>

          <h1 className="text-4xl font-bold">Forgot Password</h1>

          <p className="text-gray-400 mt-3">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleForgotPassword} className="mt-8 space-y-5">
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full bg-black/30 border border-gray-700 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {message && <p className="text-green-400 text-sm text-center">{message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-bold hover:scale-[1.02] duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Remember your password?
          <Link to="/login" className="text-blue-400 ml-2">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
