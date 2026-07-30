const express = require("express");
const rateLimit = require("express-rate-limit");

const { translateScript } = require("../controllers/translateController");
const { validateLang, validateTextSize } = require("../middleware/validate");

const router = express.Router();

// Max 15 translation requests per 15 min per IP
const translateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many translation requests. Please wait a few minutes and try again.",
  },
});

router.post(
  "/translate",
  translateLimiter,
  validateLang("targetLang"),  // Whitelist targetLang field
  validateTextSize,             // Reject oversized text
  translateScript
);

module.exports = router;
