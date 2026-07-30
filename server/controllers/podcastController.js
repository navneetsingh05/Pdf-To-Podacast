const fs = require("fs");
const pdfParse = require("pdf-parse");
const fileType = require("file-type");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { translate } = require("@vitalets/google-translate-api");
const { ALLOWED_LANGS } = require("../middleware/validate");

// Language code → human-readable name mapping for Gemini prompt
const LANG_NAMES = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  "zh-CN": "Chinese (Simplified)",
  ar: "Arabic",
  pt: "Portuguese",
  ru: "Russian",
  ko: "Korean",
  it: "Italian",
  tr: "Turkish",
  nl: "Dutch",
  pl: "Polish",
  sv: "Swedish",
  id: "Indonesian",
  th: "Thai",
  bn: "Bengali",
  mr: "Marathi",
  ta: "Tamil",
  te: "Telugu",
  gu: "Gujarati",
  ur: "Urdu",
  uk: "Ukrainian",
};

// Translate long text in chunks using Google Translate API
async function translateText(text, targetLang) {
  const CHUNK_SIZE = 4000;
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }

  const translatedChunks = [];
  for (const chunk of chunks) {
    const result = await translate(chunk, { to: targetLang });
    translatedChunks.push(result.text);
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 150));
  }

  return translatedChunks.join(" ");
}

exports.generatePodcast = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF Required",
      });
    }

    // Get target language — validate against whitelist, default to English
    const rawLang = req.body && req.body.targetLang ? req.body.targetLang.trim() : "en";
    const targetLang = ALLOWED_LANGS.has(rawLang) ? rawLang : "en";
    const langName = LANG_NAMES[targetLang] || "English";

    console.log(`[generate] targetLang: "${targetLang}" → ${langName}`);

    const pdfBuffer = fs.readFileSync(req.file.path);

    // Clean up uploaded file immediately
    fs.unlink(req.file.path, () => {});

    // Validate magic number to guarantee it's a PDF
    const type = await fileType.fromBuffer(pdfBuffer);
    if (!type || type.ext !== "pdf" || type.mime !== "application/pdf") {
      return res.status(422).json({
        success: false,
        message: "Invalid file type. The file is not a genuine PDF document.",
      });
    }

    // Parse PDF
    let pdfText;
    try {
      const pdfData = await pdfParse(pdfBuffer);
      pdfText = pdfData.text.trim();
    } catch (parseErr) {
      console.error("PDF parse error:", parseErr.message);
      return res.status(422).json({
        success: false,
        message:
          "Could not read this PDF. The file may be corrupt, password-protected, or scanned (image-only). Please try a different PDF with selectable text.",
      });
    }

    if (!pdfText) {
      return res.status(422).json({
        success: false,
        message:
          "No readable text found in this PDF. It may be a scanned/image-based PDF. Please try a text-based PDF.",
      });
    }

    // Step 1: Generate podcast script with Gemini (in English for best quality)
    let script = pdfText;
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are a podcast script writer. Convert the following extracted PDF text into a natural, engaging English podcast script.

Rules:
- Write in English only
- Sound conversational and engaging, like a real podcast
- Do not include markdown formatting, headers, asterisks, or special characters
- Just output the plain podcast script text

PDF Text:
${pdfText.substring(0, 100000)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        script = response.text();
        console.log(`[generate] Gemini script generated (English), length: ${script.length}`);
      } catch (apiError) {
        console.warn("Gemini API failed, falling back to raw text:", apiError.message);
      }
    }

    // Step 2: Translate to target language using Google Translate (100% reliable)
    if (targetLang !== "en") {
      console.log(`[generate] Translating script to ${langName} (${targetLang})...`);
      try {
        script = await translateText(script, targetLang);
        console.log(`[generate] Translation to ${langName} done. Length: ${script.length}`);
      } catch (transErr) {
        console.error(`[generate] Translation failed:`, transErr.message);
        // Return error so user knows translation failed
        return res.status(500).json({
          success: false,
          message: `Translation to ${langName} failed. Please try again or choose a different language.`,
        });
      }
    }

    res.json({
      success: true,
      script: script,
    });
  } catch (error) {
    console.error("[generate] Unexpected error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unexpected server error. Please try again.",
    });
  }
};
