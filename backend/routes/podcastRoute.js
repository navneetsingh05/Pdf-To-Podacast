const express = require("express");
const multer = require("multer");

const { generatePodcast } = require("../controllers/podcastController");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/generate", upload.single("pdf"), generatePodcast);

module.exports = router;
