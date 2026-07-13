import { useState, useRef, useEffect, useCallback } from "react";

const WORDS_PER_CHUNK = 200;

function chunkText(text, wordsPerChunk = WORDS_PER_CHUNK) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
  }
  return chunks;
}

function UploadPDF() {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [podcastScript, setPodcastScript] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const [downloading, setDownloading] = useState(false);

  const [targetLang, setTargetLang] = useState("en");
  const [translatedScript, setTranslatedScript] = useState("");
  const [translating, setTranslating] = useState(false);

  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "ja", label: "Japanese" },
    { code: "zh-CN", label: "Chinese (Simplified)" },
    { code: "ar", label: "Arabic" },
    { code: "pt", label: "Portuguese" },
    { code: "ru", label: "Russian" },
  ];

  const chunksRef = useRef([]);
  const chunkIndexRef = useRef(0);

  useEffect(() => {
    function loadVoices() {
      const available = window.speechSynthesis.getVoices();
      if (available.length) {
        setVoices(available);
        setSelectedVoice(
          (prev) =>
            available.find((v) =>
              v.lang.toLowerCase().startsWith(targetLang.toLowerCase()),
            ) ??
            prev ??
            available.find((v) => v.lang.startsWith("en")) ??
            available[0],
        );
      }
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [targetLang]);

  const speakNextChunk = useCallback(() => {
    const chunks = chunksRef.current;
    const idx = chunkIndexRef.current;

    if (idx >= chunks.length) {
      setIsPlaying(false);
      setProgress(100);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[idx]);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => {
      chunkIndexRef.current += 1;
      setProgress(Math.round((chunkIndexRef.current / chunks.length) * 100));
      speakNextChunk();
    };
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  function playAudio() {
    const text = getActiveScript();
    if (!text) return;

    window.speechSynthesis.cancel();
    chunksRef.current = chunkText(text);
    chunkIndexRef.current = 0;
    setProgress(0);
    setIsPlaying(true);
    setIsPaused(false);
    speakNextChunk();
  }

  function pauseAudio() {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }

  function resumeAudio() {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }

  function stopAudio() {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    chunkIndexRef.current = 0;
  }

  async function handleTranslate() {
    if (!podcastScript) return;

    if (targetLang === "en") {
      setTranslatedScript("");
      return;
    }

    setTranslating(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: podcastScript, targetLang }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to translate");
        return;
      }

      setTranslatedScript(data.translatedText);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while translating");
    } finally {
      setTranslating(false);
    }
  }

  function getActiveScript() {
    return targetLang !== "en" && translatedScript
      ? translatedScript
      : podcastScript;
  }

  async function downloadAudio() {
    const scriptToUse = getActiveScript();
    if (!scriptToUse) return;

    setDownloading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scriptToUse, lang: targetLang }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "podcast.mp3";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate downloadable audio. Try again.");
    } finally {
      setDownloading(false);
    }
  }

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      setPodcastScript("");
      setError("");
      stopAudio();
    }
  }

  async function generatePodcast() {
    if (!selectedFile) {
      alert("Upload PDF First");
      return;
    }

    setError("");
    setPodcastScript("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);

      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to generate podcast");
        return;
      }

      setPodcastScript(data.script);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating the podcast");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
w-full
max-w-xl
bg-gradient-to-br
from-gray-900
to-black
border
border-gray-800
rounded-3xl
p-8
shadow-2xl
"
    >
      <div
        className="
text-center
mb-8
"
      >
        <div
          className="
w-20
h-20
mx-auto
rounded-3xl
bg-gradient-to-r
from-blue-600
to-purple-600
flex
items-center
justify-center
text-4xl
mb-5
"
        >
          📄
        </div>

        <h2
          className="
text-3xl
font-bold
text-white
"
        >
          Upload PDF
        </h2>

        <p
          className="
text-gray-400
mt-3
"
        >
          Convert PDFs into AI Podcasts
        </p>
      </div>

      <label
        className="
block
border-2
border-dashed
border-gray-700
hover:border-blue-500
duration-300
rounded-2xl
p-10
cursor-pointer
bg-black/40
"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div
          className="
text-center
"
        >
          <div
            className="
text-5xl
mb-4
"
          >
            ⬆️
          </div>

          <p className="font-semibold text-lg">Click To Upload PDF</p>

          <p className="text-gray-500 mt-2">Only PDF files supported</p>
        </div>
      </label>

      {fileName && (
        <div
          className="
mt-6
bg-black
border
border-gray-800
rounded-xl
p-4
flex
justify-between
items-center
"
        >
          <p
            className="
text-gray-300
truncate
"
          >
            📄 {fileName}
          </p>

          <span
            className="
text-green-400
"
          >
            Ready
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={generatePodcast}
        disabled={loading}
        className="
w-full
mt-8
bg-gradient-to-r
from-blue-600
to-purple-600
py-4
rounded-xl
font-bold
hover:scale-[1.02]
duration-300
disabled:opacity-50
disabled:hover:scale-100
"
      >
        {loading ? "Generating Podcast..." : "Generate Podcast 🎙️"}
      </button>

      {error && (
        <div
          className="
mt-6
bg-red-950/40
border
border-red-800
rounded-xl
p-4
text-red-400
"
        >
          {error}
        </div>
      )}

      {podcastScript && (
        <div
          className="
mt-6
bg-black
border
border-gray-800
rounded-2xl
p-6
"
        >
          <p className="text-green-400 font-semibold mb-4">
            🎧 Podcast script ready — press play to listen
          </p>

          <div className="flex gap-3 mb-4">
            <select
              value={targetLang}
              onChange={(e) => {
                setTargetLang(e.target.value);
                setTranslatedScript("");
              }}
              className="
flex-1
bg-gray-900
border
border-gray-700
rounded-lg
p-2
text-gray-300
"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>

            {targetLang !== "en" && (
              <button
                onClick={handleTranslate}
                disabled={translating}
                className="
bg-purple-600
hover:bg-purple-700
duration-300
px-4
rounded-lg
font-semibold
disabled:opacity-50
"
              >
                {translating
                  ? "Translating..."
                  : translatedScript
                    ? "Re-translate"
                    : "Translate"}
              </button>
            )}
          </div>

          <select
            value={selectedVoice?.name ?? ""}
            onChange={(e) =>
              setSelectedVoice(
                voices.find((v) => v.name === e.target.value) || null,
              )
            }
            className="
w-full
bg-gray-900
border
border-gray-700
rounded-lg
p-2
text-gray-300
mb-4
"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            {!isPlaying && (
              <button
                onClick={playAudio}
                disabled={targetLang !== "en" && !translatedScript}
                className="flex-1 bg-blue-600 hover:bg-blue-700 duration-300 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                ▶ Play
              </button>
            )}
            {isPlaying && !isPaused && (
              <button
                onClick={pauseAudio}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 duration-300 py-3 rounded-xl font-semibold"
              >
                ⏸ Pause
              </button>
            )}
            {isPlaying && isPaused && (
              <button
                onClick={resumeAudio}
                className="flex-1 bg-blue-600 hover:bg-blue-700 duration-300 py-3 rounded-xl font-semibold"
              >
                ▶ Resume
              </button>
            )}
            {isPlaying && (
              <button
                onClick={stopAudio}
                className="flex-1 bg-red-600 hover:bg-red-700 duration-300 py-3 rounded-xl font-semibold"
              >
                ⏹ Stop
              </button>
            )}
          </div>

          <button
            onClick={downloadAudio}
            disabled={downloading || (targetLang !== "en" && !translatedScript)}
            className="
w-full
mt-3
bg-gray-800
hover:bg-gray-700
duration-300
py-3
rounded-xl
font-semibold
disabled:opacity-50
"
          >
            {downloading ? "Preparing MP3..." : "⬇ Download Audio"}
          </button>

          <div className="mt-4 bg-gray-800 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPDF;
