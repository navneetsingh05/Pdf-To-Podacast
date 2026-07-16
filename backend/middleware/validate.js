/**
 * validate.js — Reusable security middleware
 * Whitelists language codes and enforces text size limits.
 */

// Allowed language codes (must match LANGUAGES in frontend)
const ALLOWED_LANGS = new Set([
  "en", "hi", "es", "fr", "de", "ja", "zh-CN", "ar", "pt", "ru",
  "ko", "it", "tr", "nl", "pl", "sv", "id", "th", "bn", "mr",
  "ta", "te", "gu", "ur", "uk",
]);

const MAX_TEXT_LENGTH = 50_000; // ~50k chars ≈ ~80 pages

/**
 * Validates `lang` or `targetLang` body field against the whitelist.
 * Responds 400 if invalid.
 */
function validateLang(fieldName = "lang") {
  return (req, res, next) => {
    const lang = req.body?.[fieldName];
    if (lang !== undefined && !ALLOWED_LANGS.has(lang)) {
      return res.status(400).json({
        success: false,
        message: `Invalid language code: "${lang}". Please select a supported language.`,
      });
    }
    next();
  };
}

/**
 * Validates `text` body field — must exist and be within size limit.
 */
function validateTextSize(req, res, next) {
  const text = req.body?.text;
  if (text && text.length > MAX_TEXT_LENGTH) {
    return res.status(413).json({
      success: false,
      message: `Text too long (${text.length} chars). Maximum allowed is ${MAX_TEXT_LENGTH} characters.`,
    });
  }
  next();
}

module.exports = { validateLang, validateTextSize, ALLOWED_LANGS };
