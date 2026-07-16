const express = require("express");
const multer = require("multer");
const path = require("path");
const rateLimit = require("express-rate-limit");

const { generatePodcast } = require("../controllers/podcastController");

const router = express.Router();

// ─── Rate limit: max 5 podcast generations per 15 min per IP ──────────────
// (Heavy endpoint — calls Gemini AI + Google Translate)
const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many podcast generation requests. Please wait 15 minutes before trying again.",
  },
});

// ─── Multer: strict PDF-only upload with 10 MB cap ────────────────────────
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
    files: 1,                    // Only 1 file per request
  },
  fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    // Accept only PDF files — check both extension and MIME type
    if (ext === ".pdf" && mime === "application/pdf") {
      cb(null, true);
    } else {
      cb(
        Object.assign(new Error("Only PDF files are allowed."), {
          status: 400,
        })
      );
    }
  },
});

// Multer error handler (converts MulterError to clean JSON response)
function handleUpload(req, res, next) {
  upload.single("pdf")(req, res, (err) => {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File too large. Maximum allowed size is 10 MB.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Only one PDF file is allowed per request.",
      });
    }
    // fileFilter rejection or other multer error
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid file upload.",
    });
  });
}

router.post("/generate", generateLimiter, handleUpload, generatePodcast);

module.exports = router;
