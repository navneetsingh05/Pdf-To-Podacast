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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const guestLinks = [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how" },
    { name: "Pricing", href: "/#pricing" },
  ];

  const authLinks = [
    { name: "Dashboard", href: "/dashboard?tab=analytics", icon: "📊" },
    { name: "My Podcasts", href: "/dashboard?tab=library", icon: "🎧" },
  ];

  const notifications = [
    { icon: "✅", title: "Podcast Ready", desc: "AI Research Paper.pdf converted", time: "2 min ago", isNew: true },
    { icon: "🎙️", title: "New Feature", desc: "Multi-language voices available!", time: "1 hour ago", isNew: true },
    { icon: "📊", title: "Weekly Report", desc: "You created 5 podcasts this week", time: "Yesterday", isNew: false },
  ];
  const newNotifCount = notifications.filter((n) => n.isNew).length;

  const navStyle = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: scrolled ? "rgba(8,8,16,0.97)" : "rgba(8,8,16,0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: scrolled ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(255,255,255,0.07)",
    transition: "all 0.3s ease",
    boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.5)" : "none",
  };

  return (
    <>
      <style>{`
        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }
        .nav-right-desktop {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .nav-hamburger {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          color: rgba(255,255,255,0.8);
          flex-shrink: 0;
        }
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .nav-right-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-logo-sub { display: none; }
        }
      `}</style>

      <header style={navStyle}>
        <div className="nav-inner">

          {/* ── Logo ── */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg, #6366f1, #8b5cf6, #c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, boxShadow: "0 0 18px rgba(99,102,241,0.4)", flexShrink: 0 }}>
              🎙️
            </div>
            <div className="nav-logo-sub">
              <p style={{ fontWeight: 800, fontSize: 16, color: "#fff", lineHeight: 1.1 }}>
                PDFs<span style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ToPodcast</span>
              </p>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>AI AUDIO PLATFORM</p>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="nav-links-desktop">
            {(user ? authLinks : guestLinks).map((item, i) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={i}
                  href={item.href}
                  onClick={(e) => {
                    if (!item.href.includes("#")) {
                      e.preventDefault();
                      navigate(item.href);
                    }
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
                    fontSize: 14, fontWeight: 500, textDecoration: "none", cursor: "pointer", transition: "all 0.2s",
                    color: isActive ? "#a5b4fc" : "rgba(255,255,255,0.6)",
                    background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "transparent"; }}}
                >
                  {item.icon && <span style={{ fontSize: 13 }}>{item.icon}</span>}
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* ── Desktop Right ── */}
          <div className="nav-right-desktop">
            {user ? (
              <>
                {/* New Podcast button */}
                <button
                  onClick={() => navigate("/dashboard?tab=create")}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 0 20px rgba(99,102,241,0.3)", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(99,102,241,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.3)"; }}
                >
                  ⚡ New Podcast
                </button>

                {/* Notification Bell */}
                <div style={{ position: "relative" }} ref={notifRef}>
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, transition: "all 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  >
                    🔔
                    {newNotifCount > 0 && (
                      <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 6px rgba(99,102,241,0.9)" }} />
                    )}
                  </button>

                  {notifOpen && (
                    <div style={{ position: "absolute", top: 48, right: 0, width: 300, background: "#111121", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, boxShadow: "0 24px 60px rgba(0,0,0,0.7)", overflow: "hidden", zIndex: 999 }}>
                      <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontWeight: 700, fontSize: 14 }}>Notifications</p>
                        <span style={{ fontSize: 11, color: "#a5b4fc", background: "rgba(99,102,241,0.15)", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>{newNotifCount} new</span>
                      </div>
                      {notifications.map((n, i) => (
                        <div key={i} style={{ padding: "12px 18px", background: n.isNew ? "rgba(99,102,241,0.05)" : "transparent", borderBottom: i < notifications.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", display: "flex", gap: 10, cursor: "pointer", transition: "background 0.2s" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = n.isNew ? "rgba(99,102,241,0.05)" : "transparent"}
                        >
                          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{n.icon}</span>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <p style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</p>
                              {n.isNew && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />}
                            </div>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{n.desc}</p>
                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 3 }}>{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div style={{ position: "relative" }} ref={dropdownRef}>
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 5px", borderRadius: 12, background: profileOpen ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.05)", border: profileOpen ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {initials}
                      </div>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.name?.split(" ")[0]}
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", transition: "transform 0.2s", transform: profileOpen ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                  </button>

                  {profileOpen && (
                    <div style={{ position: "absolute", top: 50, right: 0, width: 270, background: "#111121", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,0.7)", overflow: "hidden", zIndex: 999 }}>
                      {/* User header */}
                      <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>{initials}</div>
                        <div style={{ overflow: "hidden" }}>
                          <p style={{ fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                          <span style={{ fontSize: 10, color: "#34d399", background: "rgba(52,211,153,0.1)", padding: "1px 7px", borderRadius: 99, marginTop: 4, display: "inline-block", fontWeight: 600 }}>✓ Active</span>
                        </div>
                      </div>

                      {/* Stats strip */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        {[{ v: "12", l: "Podcasts" }, { v: "140m", l: "Audio" }, { v: "7d", l: "Streak" }].map((s, i) => (
                          <div key={i} style={{ textAlign: "center", padding: "7px 4px", borderRadius: 10, background: "rgba(255,255,255,0.04)" }}>
                            <p style={{ fontWeight: 800, fontSize: 14, color: "#a5b4fc" }}>{s.v}</p>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{s.l}</p>
                          </div>
                        ))}
                      </div>

                      {/* Menu items */}
                      <div style={{ padding: "8px" }}>
                        {[
                          { icon: "📊", label: "Dashboard", sub: "Your workspace", action: () => navigate("/dashboard?tab=analytics") },
                          { icon: "🎧", label: "My Library", sub: "All your podcasts", action: () => navigate("/dashboard?tab=library") },
                          { icon: "⚡", label: "New Podcast", sub: "Upload & convert PDF", action: () => navigate("/dashboard?tab=create") },
                        ].map((item, i) => (
                          <button key={i} onClick={() => { setProfileOpen(false); item.action(); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 11, background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "rgba(255,255,255,0.7)", transition: "all 0.15s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                          >
                            <span style={{ fontSize: 17, width: 24, textAlign: "center" }}>{item.icon}</span>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</p>
                              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{item.sub}</p>
                            </div>
                          </button>
                        ))}

                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 4, paddingTop: 4 }}>
                          <button onClick={handleLogout}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 11, background: "none", border: "none", cursor: "pointer", color: "#f87171", transition: "background 0.15s" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                          >
                            <span style={{ fontSize: 17, width: 24, textAlign: "center" }}>🚪</span>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600 }}>Sign Out</p>
                              <p style={{ fontSize: 11, color: "rgba(248,113,113,0.5)", marginTop: 1 }}>See you soon!</p>
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
                <Link to="/login" style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", fontWeight: 500, fontSize: 14, textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap", display: "inline-block" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                >
                  Log in
                </Link>
                <Link to="/signup" style={{ padding: "9px 18px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none", transition: "all 0.2s", boxShadow: "0 0 20px rgba(99,102,241,0.3)", whiteSpace: "nowrap", display: "inline-block" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(99,102,241,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.3)"; }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-hamburger">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div style={{ background: "rgba(8,8,16,0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 20px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(user ? authLinks : guestLinks).map((item, i) => (
                <a key={i} href={item.href} onClick={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.name}
                </a>
              ))}

              {user ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", borderRadius: 14, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", marginTop: 6 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{initials}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout}
                    style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: 14, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                  >
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    style={{ padding: "13px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#fff", fontWeight: 500, fontSize: 15, textDecoration: "none", textAlign: "center", display: "block" }}
                  >Log in</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}
                    style={{ padding: "13px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: 600, fontSize: 15, textDecoration: "none", textAlign: "center", display: "block" }}
                  >Get Started Free</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
