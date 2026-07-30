const gtts = require("google-tts-api");
const { ALLOWED_LANGS } = require("../middleware/validate");

const MAX_TEXT_LENGTH = 50_000;

// Google's TTS endpoint caps out around 200 characters per request,
// so we split the script into safe chunks and stitch the resulting
// MP3 buffers together into one file.
function splitIntoChunks(text, maxLen = 200) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxLen) {
      if (current) chunks.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}

// Free/unofficial TTS endpoint - occasionally a single chunk request
// can fail under load, so we retry each chunk a couple times before
// giving up entirely. No character cap - full documents are supported,
// it just takes longer for bigger PDFs.
const BATCH_SIZE = 5; // concurrent requests per batch
const MAX_RETRIES = 2;

async function fetchChunkAudio(chunk, lang = "en", attempt = 0) {
  try {
    const url = gtts.getAudioUrl(chunk, {
      lang: lang,
      slow: false,
      host: "https://translate.google.com",
    });
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TTS request failed with status ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1))); // small backoff
      return fetchChunkAudio(chunk, lang, attempt + 1);
    }
    throw err;
  }
}

exports.generateAudio = async (req, res) => {
  try {
    let { text, lang } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Text required" });
    }

    // Sanitize lang — fall back to English if not in whitelist
    if (!lang || !ALLOWED_LANGS.has(lang)) {
      lang = "en";
    }

    text = text.trim();

    // Hard cap: reject oversized text
    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(413).json({
        success: false,
        message: `Text too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.`,
      });
    }
    const chunks = splitIntoChunks(text);
    const audioBuffers = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const batchBuffers = await Promise.all(
        batch.map((chunk) => fetchChunkAudio(chunk, lang || "en")),
      );
      audioBuffers.push(...batchBuffers);
    }

    const finalBuffer = Buffer.concat(audioBuffers);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=podcast.mp3",
    });
    res.send(finalBuffer);
  } catch (error) {
    console.error("[audio] TTS error:", error.message);
    res.status(500).json({
      success: false,
      message:
        "Failed to generate audio. The TTS service may be temporarily busy — please try again.",
    });
  }
};
