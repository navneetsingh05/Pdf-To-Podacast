import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const heroRef = useRef(null);

  const features = [
    {
      icon: "📄",
      gradient: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/20",
      accent: "text-blue-400",
      title: "PDF Upload",
      desc: "Drag & drop or browse. Secure, instant processing for any PDF document.",
    },
    {
      icon: "🤖",
      gradient: "from-violet-500/20 to-violet-600/5",
      border: "border-violet-500/20",
      accent: "text-violet-400",
      title: "AI Script Generation",
      desc: "Gemini AI converts dense PDF text into natural, engaging podcast dialogue.",
    },
    {
      icon: "🎙️",
      gradient: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/20",
      accent: "text-purple-400",
      title: "Realistic Audio",
      desc: "Neural voices bring your content to life with studio-quality narration.",
    },
    {
      icon: "⚡",
      gradient: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/20",
      accent: "text-amber-400",
      title: "Fast Processing",
      desc: "From upload to audio in under 60 seconds. No waiting, no queues.",
    },
  ];

  const steps = [
    {
      num: "01",
      label: "Upload PDF",
      desc: "Drop your file or browse from device",
      icon: "📄",
    },
    {
      num: "02",
      label: "Extract Text",
      desc: "AI reads and understands your document",
      icon: "🔍",
    },
    {
      num: "03",
      label: "AI Script",
      desc: "Converts content to podcast dialogue",
      icon: "✍️",
    },
    {
      num: "04",
      label: "Podcast Audio",
      desc: "Neural TTS renders the final episode",
      icon: "🎙️",
    },
  ];

  const history = [
    {
      name: "AI Research Paper.pdf",
      date: "Today, 2:14 PM",
      duration: "12 min",
      size: "2.4 MB",
      status: "ready",
    },
    {
      name: "Machine Learning Notes.pdf",
      date: "Yesterday, 9:05 AM",
      duration: "8 min",
      size: "1.1 MB",
      status: "ready",
    },
    {
      name: "Data Structures Guide.pdf",
      date: "May 19, 4:30 PM",
      duration: "21 min",
      size: "3.8 MB",
      status: "ready",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(135deg, #080810 0%, #0d0d1a 50%, #080810 100%)",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      {/* Ambient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "60vw",
            height: "60vw",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-10%",
            width: "50vw",
            height: "50vw",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            width: "30vw",
            height: "30vw",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        id="home"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-32"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a5b4fc",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#6366f1",
                  display: "inline-block",
                  boxShadow: "0 0 8px rgba(99,102,241,0.9)",
                  animation: "pulse 2s infinite",
                }}
              />
              AI-Powered PDF → Podcast Platform
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              Turn Any PDF Into{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #e879f9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "block",
                }}
              >
                a Podcast Episode
              </span>
            </h1>

            <p
              className="text-lg leading-relaxed mb-10"
              style={{ color: "rgba(255,255,255,0.5)", maxWidth: 480 }}
            >
              Upload any document and our AI extracts the content, writes a
              natural script, and generates studio-quality audio — ready to
              listen anywhere, anytime.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-14">
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 28px",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 0 32px rgba(99,102,241,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 0 48px rgba(99,102,241,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 0 32px rgba(99,102,241,0.35)";
                }}
              >
                Start for Free →
              </button>
              <button
                onClick={() => {
                  document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "14px 28px",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.04)";
                  e.target.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                ▶ Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div
              className="flex gap-10"
              style={{
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                { val: "10K+", label: "PDFs Processed", color: "#818cf8" },
                { val: "5K+", label: "Audio Generated", color: "#c084fc" },
                { val: "99%", label: "Accuracy Rate", color: "#34d399" },
              ].map((s, i) => (
                <div key={i}>
                  <p
                    className="text-3xl font-bold mb-1"
                    style={{ color: s.color }}
                  >
                    {s.val}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 28,
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p
                  className="text-xs font-medium mb-0.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  PROCESSING
                </p>
                <h3 className="text-lg font-semibold">AI Dashboard</h3>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  color: "#34d399",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#34d399",
                    display: "inline-block",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                Live
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {[
                {
                  icon: "📄",
                  label: "PDF Uploaded",
                  sub: "AI_Research_Paper.pdf · 2.4 MB",
                  done: true,
                },
                {
                  icon: "🔍",
                  label: "Text Extraction",
                  sub: "12,540 words extracted",
                  done: true,
                },
                {
                  icon: "🤖",
                  label: "AI Script Generation",
                  sub: "Writing podcast dialogue…",
                  active: true,
                },
                {
                  icon: "🎙️",
                  label: "Audio Rendering",
                  sub: "Queued · ~45 seconds",
                  done: false,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: item.active
                      ? "rgba(99,102,241,0.08)"
                      : "rgba(255,255,255,0.02)",
                    border: item.active
                      ? "1px solid rgba(99,102,241,0.3)"
                      : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transition: "all 0.3s",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: item.active ? "#fff" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {item.sub}
                    </p>
                  </div>
                  {item.done && (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(52,211,153,0.15)",
                        border: "1px solid rgba(52,211,153,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#34d399",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                  )}
                  {item.active && (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        border: "2px solid #6366f1",
                        borderTopColor: "transparent",
                        animation: "spin 0.8s linear infinite",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div
                className="flex justify-between text-xs mb-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <span>Overall Progress</span>
                <span>65%</span>
              </div>
              <div
                style={{
                  height: 5,
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "65%",
                    borderRadius: 99,
                    background: "linear-gradient(90deg, #6366f1, #c084fc)",
                    boxShadow: "0 0 10px rgba(99,102,241,0.6)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 pb-32"
      >
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-widest mb-3"
            style={{ color: "#6366f1" }}
          >
            CAPABILITIES
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ letterSpacing: "-0.02em" }}
          >
            Everything You Need
          </h2>
          <p
            className="text-base mt-4 max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            A complete pipeline from document to audio, powered by
            state-of-the-art AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "28px 24px",
                cursor: "default",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.border = "1px solid rgba(99,102,241,0.3)";
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.border =
                  "1px solid rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 18,
                }}
              >
                {item.icon}
              </div>
              <h3 className="text-base font-semibold mb-2">{item.title}</h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how" className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-widest mb-3"
            style={{ color: "#c084fc" }}
          >
            WORKFLOW
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ letterSpacing: "-0.02em" }}
          >
            How It Works
          </h2>
          <p
            className="text-base mt-4 max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Four simple steps from document to podcast. No technical knowledge
            required.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 relative">
          {/* connector line */}
          <div
            className="hidden md:block absolute top-10 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 6%, rgba(99,102,241,0.2) 20%, rgba(99,102,241,0.2) 80%, transparent 94%)",
              zIndex: 0,
              top: 36,
            }}
          />

          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background:
                  activeStep === i
                    ? "rgba(99,102,241,0.1)"
                    : "rgba(255,255,255,0.02)",
                border:
                  activeStep === i
                    ? "1px solid rgba(99,102,241,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "28px 20px",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
                transition: "all 0.4s",
                transform: activeStep === i ? "translateY(-4px)" : "none",
                boxShadow:
                  activeStep === i
                    ? "0 12px 40px rgba(99,102,241,0.15)"
                    : "none",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background:
                    activeStep === i
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "rgba(255,255,255,0.05)",
                  border:
                    activeStep === i
                      ? "none"
                      : "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 20,
                  boxShadow:
                    activeStep === i ? "0 0 20px rgba(99,102,241,0.5)" : "none",
                  transition: "all 0.4s",
                }}
              >
                {step.icon}
              </div>

              <p
                className="text-xs font-bold tracking-widest mb-2"
                style={{
                  color:
                    activeStep === i ? "#818cf8" : "rgba(255,255,255,0.25)",
                }}
              >
                {step.num}
              </p>
              <h3 className="text-base font-semibold mb-2">{step.label}</h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HISTORY ────────────────────────────────────────────── */}
      <section
        id="history"
        className="relative z-10 max-w-7xl mx-auto px-6 pb-28"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs font-semibold tracking-widest mb-2"
              style={{ color: "#34d399" }}
            >
              LIBRARY
            </p>
            <h2
              className="text-4xl font-bold"
              style={{ letterSpacing: "-0.02em" }}
            >
              Recent Podcasts
            </h2>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "9px 18px",
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#fff";
              e.target.style.borderColor = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "rgba(255,255,255,0.5)";
              e.target.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {history.map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              {/* File icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                📄
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="text-sm font-medium truncate mb-1">{item.name}</p>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {item.date}
                  </span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      display: "inline-block",
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    🎙️ {item.duration}
                  </span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      display: "inline-block",
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {item.size}
                  </span>
                </div>
              </div>

              {/* Badge */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  color: "#34d399",
                  flexShrink: 0,
                }}
              >
                ✓ Ready
              </div>

              {/* Open Button */}
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  borderRadius: 10,
                  padding: "9px 20px",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 0 18px rgba(99,102,241,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = "0 0 28px rgba(99,102,241,0.5)";
                  e.target.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = "0 0 18px rgba(99,102,241,0.3)";
                  e.target.style.transform = "scale(1)";
                }}
              >
                ▶ Play
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div
          style={{
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 28,
            padding: "64px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60%",
              height: "80%",
              background:
                "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <p
            className="text-xs font-semibold tracking-widest mb-4"
            style={{ color: "#818cf8" }}
          >
            GET STARTED TODAY
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Ready to Transform Your PDFs?
          </h2>
          <p
            className="text-base mb-10 max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Join thousands of learners who already listen to their documents
            instead of reading them.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: 14,
              padding: "16px 36px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 0 40px rgba(99,102,241,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 0 60px rgba(99,102,241,0.55)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 0 40px rgba(99,102,241,0.4)";
            }}
          >
            Upload Your First PDF — It's Free
          </button>
        </div>
      </section>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Home;
