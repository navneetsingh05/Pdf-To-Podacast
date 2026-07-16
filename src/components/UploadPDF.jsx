import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_KEY = import.meta.env.VITE_API_KEY || "super-secret-podcast-api-key-2026";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "zh-CN", label: "Chinese", flag: "🇨🇳" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
  { code: "tr", label: "Turkish", flag: "🇹🇷" },
  { code: "nl", label: "Dutch", flag: "🇳🇱" },
  { code: "pl", label: "Polish", flag: "🇵🇱" },
  { code: "sv", label: "Swedish", flag: "🇸🇪" },
  { code: "id", label: "Indonesian", flag: "🇮🇩" },
  { code: "th", label: "Thai", flag: "🇹🇭" },
  { code: "bn", label: "Bengali", flag: "🇧🇩" },
  { code: "mr", label: "Marathi", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", flag: "🇮🇳" },
  { code: "te", label: "Telugu", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", flag: "🇮🇳" },
  { code: "ur", label: "Urdu", flag: "🇵🇰" },
  { code: "uk", label: "Ukrainian", flag: "🇺🇦" },
];

function UploadPDF({ onSuccess }) {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [podcastScript, setPodcastScript] = useState("");

  const [targetLang, setTargetLang] = useState("en");

  // Audio playback via backend TTS (works for all languages including Hindi)
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [speed, setSpeed] = useState(1); // 1 = normal speed

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) window.URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      setPodcastScript("");
      setError("");
      setAudioUrl(null);
      setIsPlaying(false);
    }
  }

  async function fetchAudioBlob(text, lang) {
    const response = await fetch(`${API_URL}/api/audio`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": API_KEY 
      },
      body: JSON.stringify({ text, lang }),
    });
    if (!response.ok) throw new Error("Audio generation failed");
    return await response.blob();
  }

  async function generatePodcast() {
    if (!selectedFile) {
      alert("Upload PDF First");
      return;
    }

    setError("");
    setPodcastScript("");
    setAudioUrl(null);
    setIsPlaying(false);
    setLoading(true);
    setLoadingStep("generating");

    try {
      // Step 1: Extract text + Gemini generates script directly in target language
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("targetLang", targetLang); // Tell backend which language to use

      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to generate podcast. Please try a different PDF."
        );
      }

      // Script is already in the selected language (Gemini handles it directly)
      let finalScript = data.script;

      setPodcastScript(finalScript);

      // Step 3: Pre-generate audio via backend TTS
      setLoadingStep("audio");
      const blob = await fetchAudioBlob(finalScript, targetLang);
      const url = window.URL.createObjectURL(blob);
      setAudioUrl(url);

      // Save to history
      const newPodcast = {
        title: selectedFile.name || "Unknown PDF",
        time: new Date().toLocaleString(),
        lang: targetLang,
        langLabel: LANGUAGES.find((l) => l.code === targetLang)?.label || "English",
        script: finalScript,
      };
      const podcasts = JSON.parse(localStorage.getItem("podcasts")) || [];
      podcasts.unshift(newPodcast);
      localStorage.setItem("podcasts", JSON.stringify(podcasts));
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Could not connect to server. Make sure the backend is running on port 8000."
      );
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  }

  async function downloadAudio() {
    if (!podcastScript) return;
    setDownloading(true);
    setError("");
    try {
      const blob = await fetchAudioBlob(podcastScript, targetLang);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const langLabel =
        LANGUAGES.find((l) => l.code === targetLang)?.label || "en";
      link.download = `podcast_${langLabel.toLowerCase()}.mp3`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to download audio. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const selectedLangInfo = LANGUAGES.find((l) => l.code === targetLang);

  const stepLabel = {
    generating: targetLang !== "en"
      ? `Generating & Translating to ${selectedLangInfo?.label}...`
      : "Generating AI Script...",
    audio: `Creating ${selectedLangInfo?.label} Audio...`,
  };

  return (
    <div className="text-white">
      <p className="text-center text-gray-400 text-sm mb-4">
        Convert PDFs into AI Podcasts
      </p>

      {/* Upload Zone */}
      <label
        htmlFor="pdf-upload"
        className="block border-2 border-dashed border-blue-500/40 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500/80 hover:bg-blue-500/5 transition-all duration-300 mb-4"
      >
        <div className="text-5xl mb-3">⬆️</div>
        <p className="font-semibold text-white">Click To Upload PDF</p>
        <p className="text-gray-500 text-sm mt-1">Only PDF files supported</p>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {/* File name badge */}
      {fileName && (
        <div className="flex items-center justify-between bg-black/40 border border-gray-800 rounded-xl px-4 py-3 mb-4">
          <span className="text-sm text-gray-300">📄 {fileName}</span>
          <span className="text-green-400 text-sm font-semibold">Ready</span>
        </div>
      )}

      {/* Language Selector */}
      <div className="mb-4">
        <label className="text-sm text-gray-400 mb-2 block">
          🌐 Select Output Language
        </label>
        <select
          value={targetLang}
          onChange={(e) => {
            setTargetLang(e.target.value);
            setPodcastScript("");
            setAudioUrl(null);
            setIsPlaying(false);
            setError("");
          }}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePodcast}
        disabled={loading || !selectedFile}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {stepLabel[loadingStep] || "Processing..."}
          </span>
        ) : (
          `Generate ${selectedLangInfo?.flag || "🎙️"} ${selectedLangInfo?.label || "English"} Podcast`
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-950/40 border border-red-800 rounded-xl p-4 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Audio Player — rendered once audioUrl is ready */}
      {audioUrl && (
        <div className="mt-6 bg-black/50 border border-gray-800 rounded-2xl p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{selectedLangInfo?.flag}</span>
            <div>
              <p className="text-green-400 font-semibold text-sm">
                ✅ Podcast ready in {selectedLangInfo?.label}!
              </p>
              <p className="text-gray-500 text-xs">
                Press play to listen in {selectedLangInfo?.label}
              </p>
            </div>
          </div>

          {/* Speed Control */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-400">🐢 Speed</label>
              <span className="text-xs font-bold text-blue-400">{speed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={speed}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSpeed(val);
                if (audioRef.current) audioRef.current.playbackRate = val;
              }}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-0.5">
              <span>0.5x Slow</span>
              <span>1x Normal</span>
              <span>2x Fast</span>
            </div>
          </div>

          {/* Native HTML5 audio player — works for ALL languages */}
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            onPlay={() => {
              setIsPlaying(true);
              if (audioRef.current) audioRef.current.playbackRate = speed;
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="w-full rounded-lg mb-4"
            style={{ accentColor: "#6366f1" }}
          />

          {/* Download Button */}
          <button
            onClick={downloadAudio}
            disabled={downloading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 duration-300 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Preparing MP3...
              </>
            ) : (
              `⬇ Download ${selectedLangInfo?.label} Audio`
            )}
          </button>

          {/* Script preview */}
          <details className="mt-4">
            <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-300 transition-colors">
              📄 View Script
            </summary>
            <p className="mt-2 text-gray-400 text-xs leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap border-t border-gray-800 pt-2">
              {podcastScript}
            </p>
          </details>
        </div>
      )}
    </div>
  );
}

export default UploadPDF;
