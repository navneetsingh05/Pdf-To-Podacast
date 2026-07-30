import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Shared inline style helpers ──────────────────────────
const S = {
  section: { position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px" },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#6366f1", textTransform: "uppercase", marginBottom: 12 },
  sectionTitle: { fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" },
  sectionSub: { fontSize: 16, color: "rgba(255,255,255,0.45)", marginTop: 12, maxWidth: 500 },
};

function Home() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setUser(JSON.parse(stored));
    const interval = setInterval(() => {
      setActiveStep((p) => (p + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: "📄", color: "#6366f1", title: "Secure PDF Upload", desc: "Drag & drop or browse. Bank-grade encryption on every file. Supports scanned and text-based PDFs." },
    { icon: "🤖", color: "#8b5cf6", title: "Gemini AI Script", desc: "Google's Gemini AI rewrites dense academic or corporate language into natural, engaging dialogue." },
    { icon: "🎙️", color: "#c084fc", title: "Studio-Quality Audio", desc: "Neural voice synthesis renders podcast-grade narration — no robotic monotone, ever." },
    { icon: "⚡", color: "#f59e0b", title: "Under 60 Seconds", desc: "From upload to a fully produced podcast episode in less time than it takes to brew coffee." },
    { icon: "🌐", color: "#34d399", title: "Multi-Language", desc: "Convert and narrate in 20+ languages — perfect for global teams and multilingual learners." },
    { icon: "📥", color: "#60a5fa", title: "Instant Download", desc: "Download your MP3 episode directly or share via a private link. No subscriptions required." },
  ];

  const steps = [
    { num: "01", label: "Upload PDF", desc: "Drop your file or browse from device", icon: "📄" },
    { num: "02", label: "Extract Text", desc: "AI reads and understands your document", icon: "🔍" },
    { num: "03", label: "Generate Script", desc: "Converts content to podcast dialogue", icon: "✍️" },
    { num: "04", label: "Download Audio", desc: "Neural TTS renders the final episode", icon: "🎙️" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "PhD Student, IIT Delhi", avatar: "PS", quote: "I convert my research papers every week now. It's genuinely addicted. I can 'read' 3 papers during my morning run!", stars: 5, color: "#6366f1" },
    { name: "Marcus Chen", role: "Product Manager, Stripe", avatar: "MC", quote: "We use it for onboarding docs. New hires listen to policy PDFs during their commute. Adoption went up 60%.", stars: 5, color: "#8b5cf6" },
    { name: "Sarah O'Brien", role: "Content Creator", avatar: "SO", quote: "The audio quality shocked me. It sounds like a real person, not a robot. My audience can't tell the difference.", stars: 5, color: "#c084fc" },
    { name: "Raj Patel", role: "UPSC Aspirant", avatar: "RP", quote: "Converted the entire NCERT syllabus into podcasts. Study on the go has never been this easy.", stars: 5, color: "#34d399" },
  ];

  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      desc: "Perfect for trying out the platform",
      color: "rgba(255,255,255,0.06)",
      border: "rgba(255,255,255,0.1)",
      features: ["5 PDFs per month", "Up to 10 MB per file", "MP3 download", "1 voice option", "Email support"],
      cta: "Get Started Free",
      ctaBg: "rgba(255,255,255,0.07)",
      ctaColor: "#fff",
      ctaBorder: "rgba(255,255,255,0.15)",
      popular: false,
    },
    {
      name: "Pro",
      price: "₹599",
      period: "/month",
      desc: "For power users and professionals",
      color: "rgba(99,102,241,0.1)",
      border: "rgba(99,102,241,0.4)",
      features: ["Unlimited PDFs", "Up to 50 MB per file", "MP3 + WAV download", "10 voice options", "Priority processing", "20+ languages"],
      cta: "Start Pro — Free Trial",
      ctaBg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      ctaColor: "#fff",
      ctaBorder: "none",
      popular: true,
    },
    {
      name: "Team",
      price: "₹1,999",
      period: "/month",
      desc: "For organizations and teams",
      color: "rgba(255,255,255,0.06)",
      border: "rgba(255,255,255,0.1)",
      features: ["Everything in Pro", "5 team seats", "Shared workspace", "API access", "Custom voice upload", "Dedicated support"],
      cta: "Contact Sales",
      ctaBg: "rgba(255,255,255,0.07)",
      ctaColor: "#fff",
      ctaBorder: "rgba(255,255,255,0.15)",
      popular: false,
    },
  ];

  const faqs = [
    { q: "Is my PDF data secure?", a: "Yes. All uploads are end-to-end encrypted and automatically deleted after processing. We never store your document content." },
    { q: "What types of PDFs are supported?", a: "We support text-based and scanned PDFs (using OCR). Presentations, research papers, reports, books — if it has text, we can convert it." },
    { q: "How long does conversion take?", a: "Most PDFs convert in under 60 seconds. Larger documents (50+ pages) may take 2–3 minutes. You'll get notified when it's ready." },
    { q: "Can I choose the voice?", a: "Yes! On the Pro plan you can choose from 10 neural voices across different genders and accents. More voices are added monthly." },
    { q: "Is there a free plan?", a: "Absolutely. The Starter plan is completely free — no credit card needed. You get 5 conversions per month to try the service." },
  ];

  const history = [
    { name: "AI Research Paper.pdf", date: "Today, 2:14 PM", duration: "12 min", size: "2.4 MB" },
    { name: "Machine Learning Notes.pdf", date: "Yesterday, 9:05 AM", duration: "8 min", size: "1.1 MB" },
    { name: "Data Structures Guide.pdf", date: "May 19, 4:30 PM", duration: "21 min", size: "3.8 MB" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", overflowX: "hidden", fontFamily: "'Inter', 'DM Sans', sans-serif" }}>

      {/* ── Ambient Background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-15%", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "-15%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", top: "45%", left: "35%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 65%)" }} />
      </div>

      <Navbar />

      {/* ════════════════════════════════════════════════════
          §1  HERO
      ════════════════════════════════════════════════════ */}
      <section ref={heroRef} id="home" style={{ ...S.section, paddingTop: "clamp(60px, 8vw, 120px)", paddingBottom: "clamp(60px, 8vw, 120px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(40px, 5vw, 80px)", alignItems: "center" }}>

          {/* Left copy */}
          <div>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 8px", borderRadius: 99, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", marginBottom: 28 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "rgba(99,102,241,0.3)", fontSize: 12 }}>✨</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc", letterSpacing: "0.02em" }}>Powered by Google Gemini AI</span>
            </div>

            <h1 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24 }}>
              Turn Any PDF Into{" "}
              <br />
              <span className="gradient-text">a Podcast Episode</span>
            </h1>

            <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 460, marginBottom: 36 }}>
              Upload any document — research papers, textbooks, reports — and our AI extracts the content, writes a natural script, and generates studio-quality audio you can listen to anywhere.
            </p>

            {/* CTA Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 48 }}>
              <button
                onClick={() => navigate(user ? "/dashboard" : "/signup")}
                style={{ padding: "15px 32px", borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 0 40px rgba(99,102,241,0.4)", transition: "all 0.25s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(99,102,241,0.55)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.4)"; }}
              >
                {user ? "Go to Dashboard →" : "Start for Free →"}
              </button>
              <button
                onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
                style={{ padding: "15px 28px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontWeight: 500, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              >
                ▶ Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex" }}>
                {["A","B","C","D","E"].map((l, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${240 + i*30}, 70%, 55%)`, border: "2px solid #080810", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map((s) => <span key={s} style={{ color: "#fbbf24", fontSize: 13 }}>★</span>)}</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Loved by 10,000+ users</p>
              </div>
              <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.1)" }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>No credit card</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>required</p>
              </div>
            </div>
          </div>

          {/* Right — Live Dashboard Card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 440, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "clamp(20px, 3vw, 28px)", backdropFilter: "blur(20px)", boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>PROCESSING</p>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>AI Dashboard</h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", fontSize: 12, fontWeight: 600, color: "#34d399" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse 1.5s infinite", display: "inline-block" }} />
                  Live
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "📄", label: "PDF Uploaded", sub: "AI_Research_Paper.pdf · 2.4 MB", done: true },
                  { icon: "🔍", label: "Text Extraction", sub: "12,540 words extracted", done: true },
                  { icon: "🤖", label: "AI Script Generation", sub: "Writing podcast dialogue…", active: true },
                  { icon: "🎙️", label: "Audio Rendering", sub: "Queued · ~45 seconds", done: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, background: item.active ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)", border: item.active ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s" }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: item.active ? "#fff" : "rgba(255,255,255,0.65)" }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{item.sub}</p>
                    </div>
                    {item.done && <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#34d399", flexShrink: 0 }}>✓</div>}
                    {item.active && <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #6366f1", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />}
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div style={{ marginTop: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>
                  <span>Overall Progress</span>
                  <span style={{ color: "#a5b4fc", fontWeight: 600 }}>65%</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                  <div style={{ height: "100%", width: "65%", borderRadius: 99, background: "linear-gradient(90deg, #6366f1, #c084fc)", boxShadow: "0 0 12px rgba(99,102,241,0.6)", transition: "width 1s ease" }} />
                </div>
              </div>

              {/* Recent files row */}
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Recent</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {history.slice(0, 2).map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize: 14 }}>📄</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{h.duration} · {h.date}</p>
                      </div>
                      <span style={{ fontSize: 12, color: "#34d399" }}>▶</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(24px, 4vw, 60px)", marginTop: "clamp(48px, 6vw, 80px)", padding: "32px clamp(20px, 4vw, 48px)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20 }}>
          {[
            { val: "10K+", label: "PDFs Processed", color: "#818cf8" },
            { val: "<60s", label: "Avg. Conversion Time", color: "#c084fc" },
            { val: "99%", label: "Accuracy Rate", color: "#34d399" },
            { val: "20+", label: "Languages Supported", color: "#60a5fa" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §2  FEATURES
      ════════════════════════════════════════════════════ */}
      <section id="features" style={{ ...S.section, paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={S.sectionLabel}>CAPABILITIES</p>
          <h2 style={S.sectionTitle}>Everything You Need</h2>
          <p style={{ ...S.sectionSub, margin: "12px auto 0" }}>
            A complete AI pipeline from document to audio, engineered for quality.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {features.map((item, i) => (
            <div
              key={i}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 24px", cursor: "default", transition: "all 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.border = `1px solid ${item.color}44`;
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 16px 48px ${item.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §3  HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section id="how" style={{ ...S.section, paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={S.sectionLabel}>WORKFLOW</p>
          <h2 style={S.sectionTitle}>How It Works</h2>
          <p style={{ ...S.sectionSub, margin: "12px auto 0" }}>
            Four simple steps from document to podcast. No technical knowledge required.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, position: "relative" }}>
          {/* Connector */}
          <div style={{ position: "absolute", top: 40, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(139,92,246,0.3), transparent)", zIndex: 0 }} className="mobile-hide" />
          {steps.map((step, i) => (
            <div key={i} style={{ background: activeStep === i ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)", border: activeStep === i ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 20px", textAlign: "center", position: "relative", zIndex: 1, transition: "all 0.4s", transform: activeStep === i ? "translateY(-6px)" : "none", boxShadow: activeStep === i ? "0 16px 48px rgba(99,102,241,0.2)" : "none" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: activeStep === i ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.05)", border: activeStep === i ? "none" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, boxShadow: activeStep === i ? "0 0 24px rgba(99,102,241,0.5)" : "none", transition: "all 0.4s" }}>
                {step.icon}
              </div>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: activeStep === i ? "#818cf8" : "rgba(255,255,255,0.2)", marginBottom: 8 }}>{step.num}</p>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{step.label}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §4  TESTIMONIALS
      ════════════════════════════════════════════════════ */}
      <section id="testimonials" style={{ ...S.section, paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={S.sectionLabel}>SOCIAL PROOF</p>
          <h2 style={S.sectionTitle}>Loved by Thousands</h2>
          <p style={{ ...S.sectionSub, margin: "12px auto 0" }}>
            Real people using PDFsToPodcast to supercharge their learning.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: "28px", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.border = `1px solid ${t.color}40`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[1,2,3,4,5].map((s) => <span key={s} style={{ color: "#fbbf24", fontSize: 14 }}>★</span>)}
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, marginBottom: 20, fontStyle: "italic" }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §5  PRICING
      ════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ ...S.section, paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={S.sectionLabel}>PRICING</p>
          <h2 style={S.sectionTitle}>Simple, Transparent Pricing</h2>
          <p style={{ ...S.sectionSub, margin: "12px auto 0" }}>
            Start free. Upgrade when you need more. No hidden fees, ever.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ background: plan.color, border: `1px solid ${plan.border}`, borderRadius: 24, padding: "32px 28px", position: "relative", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {plan.popular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", padding: "5px 18px", borderRadius: 99, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
                  ⭐ Most Popular
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 6 }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 900, color: "#fff" }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{plan.desc}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#34d399", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(user ? "/dashboard" : "/signup")}
                style={{ width: "100%", padding: "14px", borderRadius: 14, background: plan.ctaBg, border: plan.ctaBorder ? `1px solid ${plan.ctaBorder}` : "none", color: plan.ctaColor, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s", boxShadow: plan.popular ? "0 0 30px rgba(99,102,241,0.35)" : "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §6  FAQ
      ════════════════════════════════════════════════════ */}
      <section id="faq" style={{ ...S.section, paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={S.sectionLabel}>FAQ</p>
          <h2 style={S.sectionTitle}>Frequently Asked Questions</h2>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: faqOpen === i ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.02)", border: faqOpen === i ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", transition: "all 0.3s" }}>
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: "none", border: "none", color: "#fff", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ fontSize: 15, fontWeight: 600 }}>{f.q}</span>
                <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)", transition: "transform 0.3s", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)", flexShrink: 0, marginLeft: 16 }}>+</span>
              </button>
              {faqOpen === i && (
                <div style={{ padding: "0 24px 20px", fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §7  FINAL CTA BANNER
      ════════════════════════════════════════════════════ */}
      <section style={{ ...S.section, paddingBottom: 100 }}>
        <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 28, padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 60px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "70%", height: "80%", background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <p style={{ ...S.sectionLabel, marginBottom: 16 }}>GET STARTED TODAY</p>
          <h2 style={{ ...S.sectionTitle, marginBottom: 16 }}>Ready to Transform<br />Your Documents?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginBottom: 36, maxWidth: 420, margin: "0 auto 36px" }}>
            Join thousands of learners who already listen to their documents instead of reading them.
          </p>
          <button
            onClick={() => navigate(user ? "/dashboard" : "/signup")}
            style={{ padding: "16px 40px", borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 0 50px rgba(99,102,241,0.45)", transition: "all 0.25s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 0 70px rgba(99,102,241,0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 50px rgba(99,102,241,0.45)"; }}
          >
            {user ? "Upload a PDF Now →" : "Upload Your First PDF — It's Free →"}
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §8  FOOTER
      ════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "clamp(32px, 4vw, 60px)", marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎙️</div>
                <span style={{ fontWeight: 800, fontSize: 16 }}>PDFs<span className="gradient-text">ToPodcast</span></span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, maxWidth: 220 }}>
                Transform any document into an AI-powered podcast episode in under 60 seconds.
              </p>
            </div>
            {/* Links */}
            {[
              { title: "Product", links: ["Features", "How It Works", "Pricing", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"] },
            ].map((col, i) => (
              <div key={i}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>{col.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((link, j) => (
                    <a key={j} href="#" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                    >{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2026 PDFsToPodcast. All rights reserved.</p>
            <div style={{ display: "flex", gap: 12 }}>
              {["Twitter", "GitHub", "LinkedIn"].map((s, i) => (
                <a key={i} href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#a5b4fc"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                >{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
