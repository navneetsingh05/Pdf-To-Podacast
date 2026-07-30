import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync user from localStorage whenever route changes
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  }, [location.pathname]);

  // Sticky nav shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    navigate("/");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const guestLinks = [
    { name: "Features", path: "/#features" },
    { name: "How It Works", path: "/#how" },
    { name: "Pricing", path: "/#pricing" },
  ];

  const authLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Upload PDF", path: "/dashboard", icon: "📄" },
    { name: "My Podcasts", path: "/dashboard", icon: "🎧" },
  ];

  const navLinks = user ? authLinks : guestLinks;

  const notifications = [
    { icon: "✅", title: "Podcast Ready", desc: "AI Research Paper.pdf has been converted", time: "2 min ago", new: true },
    { icon: "🎙️", title: "New Feature", desc: "Multi-language voices are now available!", time: "1 hour ago", new: true },
    { icon: "📊", title: "Weekly Report", desc: "You created 5 podcasts this week", time: "Yesterday", new: false },
  ];
  const newNotifCount = notifications.filter((n) => n.new).length;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(8,8,16,0.95)" : "rgba(8,8,16,0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(99,102,241,0.2)"
          : "1px solid rgba(255,255,255,0.07)",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <nav
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #c084fc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: "0 0 20px rgba(99,102,241,0.4)",
              flexShrink: 0,
            }}
          >
            🎙️
          </div>
          <div className="mobile-hide">
            <p style={{ fontWeight: 800, fontSize: 17, color: "#fff", lineHeight: 1.1 }}>
              PDFs<span className="gradient-text">ToPodcast</span>
            </p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
              AI AUDIO PLATFORM
            </p>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" }}
          className="mobile-hide">
          {navLinks.map((item, i) => (
            <a
              key={i}
              href={item.path.startsWith("/") && !item.path.includes("#") ? undefined : item.path}
              onClick={item.path.startsWith("/") && !item.path.includes("#") ? (e) => { e.preventDefault(); navigate(item.path); } : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: location.pathname === item.path ? "#a5b4fc" : "rgba(255,255,255,0.6)",
                background: location.pathname === item.path ? "rgba(99,102,241,0.1)" : "transparent",
                border: location.pathname === item.path ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }
              }}
            >
              {item.icon && <span style={{ fontSize: 14 }}>{item.icon}</span>}
              {item.name}
            </a>
          ))}
        </div>

        {/* ── Right Section ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>

          {user ? (
            <>
              {/* ── Quick Action Button ── */}
              <button
                onClick={() => navigate("/dashboard")}
                className="mobile-hide"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 16px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 0 35px rgba(99,102,241,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.3)";
                }}
              >
                <span>⚡</span>
                New Podcast
              </button>

              {/* ── Notifications Bell ── */}
              <div style={{ position: "relative" }} ref={notifRef} className="mobile-hide">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  style={{
                    position: "relative",
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontSize: 16,
                    color: "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  🔔
                  {newNotifCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#6366f1",
                        boxShadow: "0 0 6px rgba(99,102,241,0.8)",
                        animation: "pulse 2s infinite",
                      }}
                    />
                  )}
                </button>

                {/* Notification Dropdown */}
                {notifOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: 50,
                      right: 0,
                      width: 320,
                      background: "#111121",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 18,
                      boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                      overflow: "hidden",
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>Notifications</p>
                      <span style={{ fontSize: 11, color: "#a5b4fc", fontWeight: 600, background: "rgba(99,102,241,0.15)", padding: "2px 8px", borderRadius: 99 }}>
                        {newNotifCount} new
                      </span>
                    </div>
                    {notifications.map((n, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "14px 20px",
                          borderBottom: i < notifications.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                          background: n.new ? "rgba(99,102,241,0.05)" : "transparent",
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = n.new ? "rgba(99,102,241,0.05)" : "transparent"}
                      >
                        <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{n.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <p style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>{n.title}</p>
                            {n.new && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", flexShrink: 0, boxShadow: "0 0 6px rgba(99,102,241,0.8)" }} />}
                          </div>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{n.desc}</p>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: "12px 20px", textAlign: "center" }}>
                      <button style={{ fontSize: 13, color: "#a5b4fc", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Profile Dropdown ── */}
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px 6px 6px",
                    borderRadius: 12,
                    background: profileOpen ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.05)",
                    border: profileOpen ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!profileOpen) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (!profileOpen) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  <span className="mobile-hide" style={{ fontSize: 13, fontWeight: 600, color: "#fff", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name?.split(" ")[0]}
                  </span>
                  <svg
                    style={{ width: 14, height: 14, color: "rgba(255,255,255,0.4)", transition: "transform 0.2s", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: 52,
                      right: 0,
                      width: 280,
                      background: "#111121",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 20,
                      boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                      overflow: "hidden",
                      zIndex: 200,
                    }}
                  >
                    {/* Header */}
                    <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 12 }}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>
                          {initials}
                        </div>
                      )}
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ fontWeight: 700, fontSize: 15, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{user.email}</p>
                        <span style={{ fontSize: 11, color: "#34d399", background: "rgba(52,211,153,0.1)", padding: "2px 8px", borderRadius: 99, marginTop: 4, display: "inline-block" }}>
                          ✓ Pro Account
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      {[
                        { label: "Podcasts", val: "12" },
                        { label: "Minutes", val: "140" },
                        { label: "Streak", val: "7d" },
                      ].map((s, i) => (
                        <div key={i} style={{ textAlign: "center", padding: "8px 4px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                          <p style={{ fontWeight: 700, fontSize: 16, color: "#a5b4fc" }}>{s.val}</p>
                          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: "8px" }}>
                      {[
                        { icon: "📊", label: "Dashboard", sub: "Your workspace", path: "/dashboard" },
                        { icon: "🎧", label: "My Podcasts", sub: "All your episodes", path: "/dashboard" },
                        { icon: "⚙️", label: "Settings", sub: "Account preferences", path: "/dashboard" },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => { setProfileOpen(false); navigate(item.path); }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "background 0.2s",
                            color: "rgba(255,255,255,0.7)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                          }}
                        >
                          <span style={{ fontSize: 18, width: 26, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</p>
                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{item.sub}</p>
                          </div>
                          <svg style={{ marginLeft: "auto", width: 14, height: 14, color: "rgba(255,255,255,0.2)", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}

                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 4, paddingTop: 4 }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            color: "#f87171",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                        >
                          <span style={{ fontSize: 18, width: 26, textAlign: "center" }}>🚪</span>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600 }}>Sign Out</p>
                            <p style={{ fontSize: 11, color: "rgba(248,113,113,0.6)", marginTop: 1 }}>See you soon!</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: "9px 18px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                className="mobile-hide"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: "9px 18px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 35px rgba(99,102,241,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.3)"; }}
              >
                Get Started
              </Link>
            </>
          )}

          {/* ── Hamburger (Mobile) ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 18,
              color: "rgba(255,255,255,0.8)",
            }}
            className="lg:hidden"
            style2={{ display: "flex" }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(8,8,16,0.97)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "20px 24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {navLinks.map((item, i) => (
              <a
                key={i}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.name}
              </a>
            ))}

            {user ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    marginTop: 8,
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontWeight: 500, fontSize: 14, cursor: "pointer", textAlign: "left" }}
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: "13px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#fff", fontWeight: 500, fontSize: 15, textDecoration: "none", textAlign: "center", display: "block" }}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: "13px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: 600, fontSize: 15, textDecoration: "none", textAlign: "center", display: "block" }}
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
