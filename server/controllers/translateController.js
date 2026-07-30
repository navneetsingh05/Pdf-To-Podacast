const { translate } = require("@vitalets/google-translate-api");
const { ALLOWED_LANGS } = require("../middleware/validate");

const MAX_TEXT_LENGTH = 50_000;

exports.translateScript = async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({
        success: false,
        message: "Text and targetLang are required.",
      });
    }

    if (!ALLOWED_LANGS.has(targetLang)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language code. Please select a supported language.",
      });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(413).json({
        success: false,
        message: `Text too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.`,
      });
    }

    // Split text into chunks ≤ 4000 chars to stay within Google Translate limits
    const CHUNK_SIZE = 4000;
    const chunks = [];
    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
      chunks.push(text.slice(i, i + CHUNK_SIZE));
    }

    const translatedChunks = [];
    for (const chunk of chunks) {
      const result = await translate(chunk, { to: targetLang });
      translatedChunks.push(result.text);
      // Small delay between chunks to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    }

    const translatedText = translatedChunks.join(" ");
    console.log(`Translation successful: ${text.length} chars → ${targetLang}`);

    res.json({ success: true, translatedText });
  } catch (error) {
    console.error("[translate] Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Translation failed. Please try again.",
    });
  }
};
