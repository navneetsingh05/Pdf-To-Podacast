const gtts = require("google-tts-api");

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

async function fetchChunkAudio(chunk, attempt = 0) {
  try {
    const url = gtts.getAudioUrl(chunk, {
      lang: "en",
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
      return fetchChunkAudio(chunk, attempt + 1);
    }
    throw err;
  }
}

exports.generateAudio = async (req, res) => {
  try {
    let { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text required" });
    }

    text = text.trim();
    const chunks = splitIntoChunks(text);
    const audioBuffers = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const batchBuffers = await Promise.all(
        batch.map((chunk) => fetchChunkAudio(chunk)),
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
    console.log(error);
    res
      .status(500)
      .json({
        message:
          "Failed to generate downloadable audio. Try again — the free TTS service may be temporarily busy.",
      });
  }
};
