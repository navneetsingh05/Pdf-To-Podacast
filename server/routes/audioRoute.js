const express = require("express");
const rateLimit = require("express-rate-limit");

const { generateAudio } = require("../controllers/audioController");
const { validateLang, validateTextSize } = require("../middleware/validate");

const router = express.Router();

// Max 20 audio generation requests per 15 min per IP
const audioLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many audio requests. Please wait a few minutes and try again.",
  },
});

router.post(
  "/audio",
  audioLimiter,
  validateLang("lang"),    // Whitelist lang field
  validateTextSize,        // Reject oversized text
  generateAudio
);

module.exports = router;
