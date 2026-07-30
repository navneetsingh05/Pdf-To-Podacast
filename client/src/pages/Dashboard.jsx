import UploadPDF from "../components/UploadPDF";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_KEY = import.meta.env.VITE_API_KEY || "super-secret-podcast-api-key-2026";

function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("create");
  const [audioUrls, setAudioUrls] = useState({});
  const [loadingAudioIndex, setLoadingAudioIndex] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(stored));
    loadHistory();
  }, []);

  function loadHistory() {
    const podcasts = JSON.parse(localStorage.getItem("podcasts")) || [];
    setHistory(podcasts);
    return podcasts;
  }

  function handleUploadSuccess() {
    const podcasts = JSON.parse(localStorage.getItem("podcasts")) || [];
    setHistory(podcasts);
    setActiveTab("library");
    window.scrollTo({ top: 200, behavior: "smooth" });
  }

  function deleteItem(index) {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem("podcasts", JSON.stringify(updated));
    
    // cleanup object urls
    if (audioUrls[index]) {
      window.URL.revokeObjectURL(audioUrls[index]);
      const newUrls = { ...audioUrls };
      delete newUrls[index];
      setAudioUrls(newUrls);
    }
  }

  async function fetchAudioBlob(text, lang) {
    const response = await fetch(`${API_URL}/api/audio`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      body: JSON.stringify({ text, lang }),
    });
    if (!response.ok) throw new Error("Audio generation failed");
    return await response.blob();
  }

  async function handlePlayAudio(index, script, lang) {
    if (audioUrls[index]) return;
    setLoadingAudioIndex(index);
    try {
      const blob = await fetchAudioBlob(script, lang || "en");
      const url = window.URL.createObjectURL(blob);
      setAudioUrls((prev) => ({ ...prev, [index]: url }));
    } catch (err) {
      alert("Failed to load audio. Make sure backend is running.");
    } finally {
      setLoadingAudioIndex(null);
    }
  }

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const stats = [
    { label: "Total Podcasts", val: history.length.toString(), icon: "🎧", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
    { label: "This Week", val: "3", icon: "📈", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
    { label: "Audio Minutes", val: String(history.length * 12), icon: "⏱️", color: "#34d399", bg: "rgba(52,211,153,0.1)" },
    { label: "AI Accuracy", val: "99%", icon: "🤖", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  ];

  const tabs = [
    { id: "create", label: "Create Podcast", icon: "⚡" },
    { id: "library", label: "My Library", icon: "🎧", badge: history.length },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
      <Navbar />

      {/* ── Page Layout ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* ── Welcome Header ── */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
                {initials}
              </div>
              <div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Welcome back 👋</p>
                <h1 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#fff" }}>{currentUser?.name || "User"}</h1>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", fontSize: 13, color: "#34d399", fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", animation: "pulse 1.5s infinite", display: "inline-block" }} />
              All Systems Online
            </div>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}25`, borderRadius: 18, padding: "20px 22px", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${s.color}20`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <svg style={{ width: 14, height: 14, color: s.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <p style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 6, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Tab Navigation ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, marginBottom: 28, width: "fit-content" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                background: activeTab === tab.id ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.5)",
                boxShadow: activeTab === tab.id ? "0 4px 20px rgba(99,102,241,0.3)" : "none",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span style={{ padding: "2px 8px", borderRadius: 99, background: activeTab === tab.id ? "rgba(255,255,255,0.2)" : "rgba(99,102,241,0.2)", fontSize: 11, fontWeight: 700, color: activeTab === tab.id ? "#fff" : "#a5b4fc" }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Create Tab ── */}
        {activeTab === "create" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {/* Upload Card */}
            <div style={{ gridColumn: "1 / -1", maxWidth: 680 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "clamp(20px, 3vw, 32px)", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>⚡</div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800 }}>Create New Podcast</h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Upload a PDF and let AI do the rest</p>
                  </div>
                </div>
                <UploadPDF onSuccess={handleUploadSuccess} />
              </div>

              {/* Quick Tips */}
              <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 18, padding: "20px 24px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", marginBottom: 14 }}>💡 Tips for Best Results</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  {[
                    { icon: "📝", text: "Text-based PDFs convert faster than scanned ones" },
                    { icon: "📏", text: "10–50 page PDFs yield the best podcast length" },
                    { icon: "🌐", text: "English PDFs currently produce the highest quality audio" },
                  ].map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{tip.icon}</span>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Library Tab ── */}
        {activeTab === "library" && (
          <div>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 24px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 24 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎧</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>No Podcasts Yet</h3>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>Upload your first PDF to get started</p>
                <button onClick={() => setActiveTab("create")} style={{ padding: "13px 28px", borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}>
                  ⚡ Create First Podcast
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {history.map((item, index) => (
                  <div key={index}>
                    <div style={{ background: "rgba(255,255,255,0.02)", border: expandedItem === index ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "18px 22px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", transition: "all 0.3s" }}
                      onMouseEnter={(e) => { if (expandedItem !== index) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}}
                      onMouseLeave={(e) => { if (expandedItem !== index) { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}}
                    >
                      {/* Icon */}
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎧</div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{item.time}</p>
                      </div>

                      {/* Status badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", fontSize: 12, fontWeight: 600, color: "#34d399", flexShrink: 0 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                        Ready
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                          style={{ padding: "9px 18px", borderRadius: 10, background: expandedItem === index ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)", border: expandedItem === index ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.1)", color: expandedItem === index ? "#a5b4fc" : "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}
                        >
                          {expandedItem === index ? "▲ Close" : "▼ View Script"}
                        </button>
                        <button
                          onClick={() => deleteItem(index)}
                          style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Expanded script view */}
                    {expandedItem === index && (
                      <div style={{ background: "rgba(8,8,16,0.9)", border: "1px solid rgba(99,102,241,0.2)", borderTop: "none", borderRadius: "0 0 18px 18px", padding: "20px 22px", marginTop: -2 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                          <span style={{ fontSize: 14, color: "#a5b4fc", fontWeight: 700 }}>📝 Podcast Script</span>
                          
                          {audioUrls[index] ? (
                            <audio src={audioUrls[index]} controls autoPlay style={{ height: 34, accentColor: "#6366f1", flex: 1, minWidth: 200, maxWidth: 400 }} />
                          ) : (
                            <button
                              onClick={() => handlePlayAudio(index, item.script, item.lang)}
                              disabled={loadingAudioIndex === index || !item.script}
                              style={{ padding: "8px 16px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: (loadingAudioIndex === index || !item.script) ? "not-allowed" : "pointer", opacity: (loadingAudioIndex === index || !item.script) ? 0.7 : 1, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 0 15px rgba(99,102,241,0.3)" }}
                            >
                              {loadingAudioIndex === index ? (
                                <>
                                  <svg style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                  </svg>
                                  Loading Audio...
                                </>
                              ) : "▶ Listen to Audio"}
                            </button>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 280, overflowY: "auto" }}>
                          {item.script || "No script content saved for this podcast."}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Analytics Tab ── */}
        {activeTab === "analytics" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>

            {/* AI Processing Stats */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: "28px" }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 24 }}>⚙️ AI Quality Metrics</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Audio Clarity", val: 98, color: "#6366f1" },
                  { label: "Script Accuracy", val: 95, color: "#8b5cf6" },
                  { label: "Voice Naturalness", val: 93, color: "#c084fc" },
                  { label: "Processing Speed", val: 99, color: "#34d399" },
                ].map((metric, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{metric.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: metric.color }}>{metric.val}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                      <div style={{ height: "100%", width: `${metric.val}%`, borderRadius: 99, background: `linear-gradient(90deg, ${metric.color}, ${metric.color}cc)`, boxShadow: `0 0 10px ${metric.color}50`, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: "28px" }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 24 }}>📅 Recent Activity</h3>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.3)" }}>
                  <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>📭</span>
                  <p style={{ fontSize: 14 }}>No activity yet</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {history.slice(0, 5).map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>🎧</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{item.time}</p>
                      </div>
                      <span style={{ fontSize: 11, color: "#34d399", fontWeight: 600 }}>✓ Done</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan Info */}
            <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 22, padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>⭐</span>
                <h3 style={{ fontSize: 17, fontWeight: 800 }}>Pro Plan</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "PDFs Used", val: `${history.length} / ∞`, per: "Unlimited" },
                  { label: "Storage", val: "2.4 GB / 50 GB", per: "48% free" },
                  { label: "Voices", val: "1 / 10", per: "9 available" },
                ].map((u, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{u.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc" }}>{u.val}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", padding: "12px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: "0 0 24px rgba(99,102,241,0.3)", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                🚀 Upgrade to Team Plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Dashboard;