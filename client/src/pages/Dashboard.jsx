import UploadPDF from "../components/UploadPDF";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_KEY = import.meta.env.VITE_API_KEY || "super-secret-podcast-api-key-2026";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["create", "library", "analytics"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

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
    if(!window.confirm("Are you sure you want to delete this podcast?")) return;
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem("podcasts", JSON.stringify(updated));
    
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
    { label: "Total Podcasts", val: history.length.toString(), icon: "🎧", color: "#818cf8", bg: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.02))" },
    { label: "This Week", val: "3", icon: "📈", color: "#c084fc", bg: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.02))" },
    { label: "Audio Minutes", val: String(history.length * 12), icon: "⏱️", color: "#34d399", bg: "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.02))" },
    { label: "AI Accuracy", val: "99%", icon: "🤖", color: "#60a5fa", bg: "linear-gradient(135deg, rgba(96,165,250,0.15), rgba(96,165,250,0.02))" },
  ];

  const tabs = [
    { id: "create", label: "Create Podcast", icon: "⚡" },
    { id: "library", label: "My Library", icon: "🎧", badge: history.length },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#06060c", color: "#fff", fontFamily: "'Inter', 'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      
      {/* Animated Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(0,0,0,0) 70%)", filter: "blur(60px)", zIndex: 0, animation: "float 10s infinite alternate ease-in-out" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0) 70%)", filter: "blur(60px)", zIndex: 0, animation: "float 12s infinite alternate-reverse ease-in-out" }} />

      <style>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(30px, 50px) scale(1.1); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(52,211,153,0); }
          100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        .premium-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .premium-hover:hover {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .tab-btn {
          position: relative;
        }
        .tab-btn::after {
          content: ''; position: absolute; bottom: -8px; left: 0; width: 100%; height: 3px; border-radius: 3px;
          background: linear-gradient(90deg, #6366f1, #c084fc);
          transform: scaleX(0); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tab-btn.active::after {
          transform: scaleX(1);
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 100px" }}>
          
          {/* ── Header Section ── */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, boxShadow: "0 10px 30px rgba(99,102,241,0.4)", border: "2px solid rgba(255,255,255,0.1)" }}>
                {initials}
              </div>
              <div>
                <p style={{ fontSize: 14, color: "#a5b4fc", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Workspace</p>
                <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                  Welcome back, {currentUser?.name?.split(" ")[0] || "User"}
                </h1>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 14, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", backdropFilter: "blur(10px)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", animation: "pulse-glow 2s infinite" }} />
              <span style={{ fontSize: 13, color: "#34d399", fontWeight: 700 }}>Engine Online</span>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 48 }}>
            {stats.map((s, i) => (
              <div key={i} className="premium-card" style={{ background: s.bg, borderRadius: 24, padding: "24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, fontSize: 100, opacity: 0.04, transform: "rotate(15deg)" }}>{s.icon}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: s.color, boxShadow: `0 4px 12px ${s.color}30` }}>
                    {s.icon}
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{s.label}</p>
                </div>
                <p style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* ── Segmented Tabs ── */}
          <div style={{ display: "flex", gap: 30, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginBottom: 36, overflowX: "auto", scrollbarWidth: "none" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                style={{
                  background: "none", border: "none", padding: "10px 4px", fontSize: 16, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s", whiteSpace: "nowrap",
                  color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.4)"
                }}
              >
                <span style={{ opacity: activeTab === tab.id ? 1 : 0.5 }}>{tab.icon}</span>
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span style={{ padding: "2px 8px", borderRadius: 99, background: activeTab === tab.id ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.1)", fontSize: 11, color: "#fff", marginLeft: 4 }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Create Tab ── */}
          {activeTab === "create" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr lg:350px", gap: 32, alignItems: "start" }}>
              <div className="premium-card" style={{ borderRadius: 32, padding: "clamp(24px, 4vw, 48px)" }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✨</div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>AI Generation Engine</h2>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>Upload your document and let our neural network create a studio-quality podcast.</p>
                </div>
                <UploadPDF onSuccess={handleUploadSuccess} />
              </div>

              {/* Pro Tips Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="premium-card" style={{ borderRadius: 24, padding: 24, background: "linear-gradient(180deg, rgba(99,102,241,0.05), transparent)" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#a5b4fc", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>💡</span> Pro Tips
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { title: "Native Text PDFs", desc: "For the absolute best AI comprehension, upload PDFs containing selectable text rather than scanned images." },
                      { title: "Optimal Length", desc: "Documents under 50 pages generate the most engaging, concise podcast formats." },
                      { title: "Language Support", desc: "The AI currently excels at English parsing, with more languages rolling out soon." }
                    ].map((tip, i) => (
                      <div key={i} style={{ paddingLeft: 16, borderLeft: "2px solid rgba(99,102,241,0.3)" }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{tip.title}</p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Library Tab (Grid Layout) ── */}
          {activeTab === "library" && (
            <div>
              {history.length === 0 ? (
                <div className="premium-card" style={{ textAlign: "center", padding: "100px 24px", borderRadius: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, marginBottom: 24 }}>🎧</div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Your library is empty</h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", marginBottom: 32, maxWidth: 400 }}>All your generated podcasts will appear here. Ready to create your first masterpiece?</p>
                  <button onClick={() => setActiveTab("create")} style={{ padding: "14px 32px", borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 30px rgba(99,102,241,0.4)", transition: "transform 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={(e)=>e.currentTarget.style.transform="none"}>
                    Create Podcast
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                  {history.map((item, index) => (
                    <div key={index} className="premium-card premium-hover" style={{ borderRadius: 24, padding: 24, transition: "all 0.3s", display: "flex", flexDirection: "column" }}>
                      
                      {/* Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                          🎧
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <span style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(52,211,153,0.1)", color: "#34d399", fontSize: 11, fontWeight: 700 }}>Ready</span>
                          <button onClick={() => deleteItem(index)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "none", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Delete">🗑️</button>
                        </div>
                      </div>

                      {/* Title & Meta */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{item.title}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 500 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🕒 {item.time}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📄 {item.lang || "en"}</span>
                        </div>
                      </div>

                      <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", margin: "20px 0" }} />

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => handlePlayAudio(index, item.script, item.lang)} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                          {loadingAudioIndex === index ? (
                            <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                          ) : "▶ Listen"}
                        </button>
                        
                        <button onClick={() => setExpandedItem(expandedItem === index ? null : index)} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#a5b4fc", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background="rgba(99,102,241,0.1)"} onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
                          {expandedItem === index ? "Hide Script" : "View Script"}
                        </button>
                      </div>

                      {/* Script Expander */}
                      {expandedItem === index && (
                        <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", marginBottom: 8 }}>GENERATED SCRIPT</p>
                          <div style={{ maxHeight: 200, overflowY: "auto", paddingRight: 8, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                            {item.script}
                          </div>
                        </div>
                      )}

                      {/* Audio Player */}
                      {audioUrls[index] && (
                        <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.2)" }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse-glow 2s infinite" }} />
                            AUDIO READY
                          </p>
                          <audio controls src={audioUrls[index]} style={{ width: "100%", height: 36, outline: "none" }} autoPlay />
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              
              <div className="premium-card" style={{ padding: 32, borderRadius: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                  <span style={{ fontSize: 24 }}>📈</span>
                  <h3 style={{ fontSize: 20, fontWeight: 800 }}>Quality Metrics</h3>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {[
                    { label: "Speech Naturalness", val: 94, color: "#34d399" },
                    { label: "Text Extraction", val: 88, color: "#60a5fa" },
                    { label: "Processing Speed", val: 97, color: "#c084fc" },
                  ].map((m, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{m.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.val}%</span>
                      </div>
                      <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${m.val}%`, height: "100%", background: m.color, borderRadius: 99, boxShadow: `0 0 10px ${m.color}80` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="premium-card" style={{ padding: 32, borderRadius: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                  <span style={{ fontSize: 24 }}>💳</span>
                  <h3 style={{ fontSize: 20, fontWeight: 800 }}>Plan & Usage</h3>
                </div>
                
                <div style={{ padding: 24, borderRadius: 16, background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.2)", marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase" }}>Current Plan</span>
                    <span style={{ padding: "4px 10px", background: "#6366f1", color: "#fff", fontSize: 11, fontWeight: 800, borderRadius: 8 }}>PRO</span>
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Unlimited</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>You have unlimited podcast generations.</p>
                </div>

                <button style={{ width: "100%", padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                  Manage Billing
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;