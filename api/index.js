require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const podcastRoute = require("./routes/podcastRoute");
const audioRoute = require("./routes/audioRoute");
const translateRoute = require("./routes/translateRoute");

const app = express();

// ─── Security: HTTP Headers ────────────────────────────────────────────────
app.set("trust proxy", 1); // Essential for HTTPS when deployed behind a proxy (Render/Vercel/Cloudflare)
app.use(
  helmet({
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);          // Sets security headers (XSS, clickjacking, strict HTTPS, etc.)
app.disable("x-powered-by"); // Don't advertise Express

// ─── Security: Rate Limiting (global) ─────────────────────────────────────
// Max 60 requests per 15 minutes per IP (general protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait a few minutes and try again.",
  },
});
app.use(globalLimiter);

// ─── CORS ──────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin) return callback(null, true);

      // In development: allow any localhost port
      if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // In production: allow only explicitly listed origins
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ─── Body Parsing ──────────────────────────────────────────────────────────
// 1 MB limit — PDFs are sent as multipart, not JSON, so 1 MB is ample
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

// ─── Data Sanitization ─────────────────────────────────────────────────────
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// ─── API Key Authentication ──────────────────────────────────────────────────
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid API Key.",
    });
  }
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────
app.use("/api", podcastRoute);
app.use("/api", audioRoute);
app.use("/api", translateRoute);

// ─── 404 handler ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found." });
});

// ─── Global error handler (never leaks stack traces) ──────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[server error]", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(8000, () => {
    console.log("Server Running On 8000");
  });
}

module.exports = app;
