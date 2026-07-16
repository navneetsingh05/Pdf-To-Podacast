import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    setUser(null);
    setProfileOpen(false);
    navigate("/login");
  }

  const navLinks = [
    { name: "Features", path: "/#features" },
    { name: "How It Works", path: "/#how" },
    { name: "History", path: "/#history" },
  ];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 cursor-pointer">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex justify-center items-center text-2xl shadow-lg">
            🎙️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              PDFs<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ToPodcast</span>
            </h1>
            <p className="text-gray-500 text-xs">AI Audio Platform</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="text-gray-300 hover:text-white duration-300 relative group"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="bg-white/5 border border-gray-700 px-4 py-2.5 rounded-xl flex items-center gap-3 hover:border-blue-500 duration-300"
              >
                {/* Avatar */}
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute top-14 right-0 w-64 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">

                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-gray-800 flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold">
                        {initials}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="font-semibold text-white truncate">{user.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      {user.provider === "google" && (
                        <span className="text-xs text-blue-400">via Google</span>
                      )}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      to="/dashboard"
                      onClick={() => { setProfileOpen(false); window.scrollTo({ top: 0 }); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 duration-200 text-gray-300 hover:text-white"
                    >
                      <span className="text-lg">📊</span>
                      <div>
                        <p className="text-sm font-medium">Dashboard</p>
                        <p className="text-xs text-gray-500">Your podcasts</p>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        // Show profile info in a styled alert
                        alert(`Name: ${user.name}\nEmail: ${user.email}\nProvider: ${user.provider || "email"}`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 duration-200 text-gray-300 hover:text-white text-left"
                    >
                      <span className="text-lg">👤</span>
                      <div>
                        <p className="text-sm font-medium">Profile</p>
                        <p className="text-xs text-gray-500">Account details</p>
                      </div>
                    </button>

                    <div className="border-t border-gray-800 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 duration-200 text-red-400 text-left"
                      >
                        <span className="text-lg">🚪</span>
                        <div>
                          <p className="text-sm font-medium">Logout</p>
                          <p className="text-xs text-red-400/60">Sign out of account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="px-6 py-3 rounded-xl border border-gray-700 bg-white/5 text-white font-medium duration-300 hover:border-blue-500 hover:-translate-y-0.5">
                  🔐 Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 duration-300">
                  Start Free
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white text-3xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800 px-6 py-8">
          <div className="flex flex-col gap-5">
            {navLinks.map((item, index) => (
              <a
                key={index}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 text-lg"
              >
                {item.name}
              </a>
            ))}

            {user ? (
              <>
                {/* Mobile user card */}
                <div className="flex items-center gap-3 bg-white/5 border border-gray-800 rounded-2xl p-4">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>

                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 duration-300">
                    📊 Dashboard
                  </button>
                </Link>

                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 duration-300"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <button className="w-full border border-gray-700 bg-white/5 px-6 py-3 rounded-xl text-white font-medium hover:border-blue-500 duration-300">
                    🔐 Login
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 duration-300">
                    Start Free
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
